"use strict";
(() => {
  // src/utils.ts
  var renameFile = (file, name) => {
    const renamed = new File([file], name, {
      type: file.type,
      lastModified: file.lastModified
    });
    return renamed;
  };
  async function generatorToArray(generator) {
    const items = [];
    for await (const item of generator)
      items.push(item);
    return items;
  }
  var appendPath = (base, path) => base + path + "/";
  var extendFile = (file, options) => {
    if (file && options?.addDirectoryName) {
      const filename = options.baseDirectory + file.name;
      return renameFile(file, filename);
    }
    return file;
  };
  var supportsFileSystemAccessAPI = "getAsFileSystemHandle" in DataTransferItem.prototype;
  var supportsWebkitGetAsEntry = "webkitGetAsEntry" in DataTransferItem.prototype;

  // src/filesystem.ts
  var parseDataTransferItem = async (item, options) => {
    if (supportsFileSystemAccessAPI) {
      const handle = await item.getAsFileSystemHandle();
      if (handle) {
        return readFileSystemHandlesAsync(handle, options);
      }
    }
    if (supportsWebkitGetAsEntry) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        return readFileSystemEntryAsync(entry, options);
      }
    }
    const file = item.getAsFile();
    if (file) {
      return [file];
    }
    return [];
  };
  var readFileSystemHandlesAsync = async (entry, options) => generatorToArray(readFileSystemHandleRecursively(entry, options));
  async function* readFileSystemHandleRecursively(entry, options) {
    if (isFileSystemFileHanle(entry)) {
      const file = extendFile(await entry.getFile().catch(() => null), options);
      if (file) {
        yield file;
      }
    } else if (isFileSystemDirectoryHandle(entry)) {
      for await (const handle of entry.values()) {
        yield* readFileSystemHandleRecursively(handle, {
          ...options,
          baseDirectory: appendPath(options?.baseDirectory || "", entry.name)
        });
      }
    }
  }
  var readFileSystemEntryAsync = async (entry, options) => generatorToArray(readFileSystemEntryRecursively(entry, options));
  async function* readFileSystemEntryRecursively(entry, options) {
    if (isFileSystemFile(entry)) {
      const file = extendFile(await resolveFileSystemFileEntry(entry), options);
      if (file) {
        yield file;
      }
    } else if (isFileSystemDirectory(entry)) {
      const entries = await resolveFileSystemDirectoryEntry(entry);
      for (const entry2 of entries) {
        yield* readFileSystemEntryRecursively(entry2, {
          ...options,
          baseDirectory: appendPath(options?.baseDirectory || "", entry2.name)
        });
      }
    }
  }
  var resolveFileSystemFileEntry = (entry) => new Promise((resolve, reject) => entry.file(resolve, reject));
  var resolveFileSystemDirectoryEntry = (entry) => new Promise((resolve, reject) => {
    const reader = entry.createReader();
    reader.readEntries(resolve, reject);
  });
  var isFileSystemDirectory = (entry) => entry?.isDirectory === true;
  var isFileSystemFile = (entry) => entry?.isFile === true;
  var isFileSystemDirectoryHandle = (handle) => handle?.kind === "directory";
  var isFileSystemFileHanle = (handle) => handle?.kind === "file";

  // src/index.ts
  async function parseDataTransferFiles(list, options) {
    if (list) {
      const items = Array.from(list).filter((item) => item.kind === "file");
      const fileChunks = await Promise.all(
        items.map(async (item) => parseDataTransferItem(item, options))
      );
      return fileChunks.flat();
    }
    return [];
  }
  async function parseFilesFromEvent(event, options) {
    const list = event.dataTransfer?.items;
    return parseDataTransferFiles(list, options);
  }

  // example/index.ts
  var droppedFiles = [];
  var fileSizeFormat = new Intl.NumberFormat(void 0, {
    style: "unit",
    unit: "byte"
  });
  document.addEventListener("dragover", function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
  document.addEventListener("dragleave", function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
  document.addEventListener("drop", async function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.time("parseFilesFromEvent");
    const files = await parseFilesFromEvent(event, { addDirectoryName: true });
    console.timeEnd("parseFilesFromEvent");
    droppedFiles.push(...files);
    renderFiles();
  });
  var filesSection = document.getElementById("files");
  function renderFiles() {
    if (filesSection) {
      filesSection.innerHTML = "";
    }
    for (const file of droppedFiles) {
      filesSection?.appendChild(createFileDiv(file));
    }
  }
  function createFileDiv(file) {
    const div = document.createElement("div");
    const nameElement = document.createElement("div");
    nameElement.textContent = `Name: ${file.name}`;
    div.appendChild(nameElement);
    const sizeElement = document.createElement("div");
    sizeElement.textContent = `Size: ${fileSizeFormat.format(file.size)}`;
    div.appendChild(sizeElement);
    const typeElement = document.createElement("div");
    typeElement.textContent = `Type: ${file.type}`;
    div.appendChild(typeElement);
    return div;
  }
})();
