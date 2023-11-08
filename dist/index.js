"use strict";
(() => {
  // src/filesystem.ts
  async function parseDataTransferItem(item) {
    if (supportsFileSystemAccessAPI) {
      const handle = await item.getAsFileSystemHandle();
      if (handle) {
        return readFileSystemHandlesAsync(handle);
      }
    }
    if (supportsWebkitGetAsEntry) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        return readFileSystemEntryAsync(entry);
      }
    }
    const file = item.getAsFile();
    if (file) {
      return [file];
    }
    return [];
  }
  async function readFileSystemHandlesAsync(entry) {
    return generatorToArray(readFileSystemHandlesRecursively(entry));
  }
  async function* readFileSystemHandlesRecursively(entry) {
    if (isFileSystemFileHanle(entry)) {
      const file = await entry.getFile();
      if (file) {
        yield file;
      }
    } else if (isFileSystemDirectoryHandle(entry)) {
      for await (const handle of entry.values()) {
        yield* readFileSystemHandlesRecursively(handle);
      }
    }
  }
  async function readFileSystemEntryAsync(entry) {
    return generatorToArray(readFileSystemEntryRecursively(entry));
  }
  async function* readFileSystemEntryRecursively(entry) {
    if (isFileSystemFile(entry)) {
      const file = await new Promise((resolve) => entry.file(resolve));
      yield file;
    } else if (isFileSystemDirectory(entry)) {
      const reader = entry.createReader();
      const entries = await new Promise(
        (resolve) => reader.readEntries(resolve)
      );
      for (const entry2 of entries) {
        yield* readFileSystemEntryRecursively(entry2);
      }
    }
  }
  async function generatorToArray(generator) {
    const items = [];
    for await (const item of generator)
      items.push(item);
    return items;
  }
  function isFileSystemDirectory(entry) {
    return entry?.isDirectory === true;
  }
  function isFileSystemFile(entry) {
    return entry?.isFile === true;
  }
  function isFileSystemDirectoryHandle(handle) {
    return handle?.kind === "directory";
  }
  function isFileSystemFileHanle(handle) {
    return handle?.kind === "file";
  }
  var supportsFileSystemAccessAPI = "getAsFileSystemHandle" in DataTransferItem.prototype;
  var supportsWebkitGetAsEntry = "webkitGetAsEntry" in DataTransferItem.prototype;

  // src/index.ts
  async function parseDataTransferFiles(list) {
    if (list) {
      const items = Array.from(list).filter((item) => item.kind === "file");
      const fileChunks = await Promise.all(
        items.map(async (item) => parseDataTransferItem(item))
      );
      return fileChunks.flat();
    }
    return [];
  }
  async function parseFilesFromEvent(event) {
    const list = event.dataTransfer?.items;
    return parseDataTransferFiles(list);
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
    const files = await parseFilesFromEvent(event);
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
      filesSection?.appendChild(document.createElement("hr"));
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
