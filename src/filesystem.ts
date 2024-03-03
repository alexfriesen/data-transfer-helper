import {
  appendPath,
  extendFile,
  generatorToArray,
  supportsFileSystemAccessAPI,
  supportsWebkitGetAsEntry,
} from "./utils";
import { Options } from "./options";

export const parseDataTransferItem = async (
  item: DataTransferItem,
  options?: Options
): Promise<File[]> => {
  if (
    supportsFileSystemAccessAPI &&
    options?.disableFileSystemAccessAPI !== true
  ) {
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle
    const handle = await item.getAsFileSystemHandle();
    if (handle) {
      return readFileSystemHandlesAsync(handle, options);
    }
  }

  if (supportsWebkitGetAsEntry) {
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
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

const readFileSystemHandlesAsync = async (
  entry: FileSystemHandle,
  options?: Options
): Promise<File[]> =>
  generatorToArray(readFileSystemHandleRecursively(entry, options));

async function* readFileSystemHandleRecursively(
  entry: FileSystemHandle,
  options?: Options
): AsyncGenerator<File> {
  if (isFileSystemFileHanle(entry)) {
    const file = extendFile(await entry.getFile().catch(() => null), options);
    if (file) {
      yield file;
    }
  } else if (isFileSystemDirectoryHandle(entry)) {
    const baseDirectory = appendPath(options?.baseDirectory || "", entry.name);
    for await (const handle of entry.values()) {
      yield* readFileSystemHandleRecursively(handle, {
        ...options,
        baseDirectory,
      });
    }
  }
}

const readFileSystemEntryAsync = async (
  entry: FileSystemEntry,
  options?: Options
): Promise<File[]> =>
  generatorToArray(readFileSystemEntryRecursively(entry, options));

async function* readFileSystemEntryRecursively(
  entry: FileSystemEntry,
  options?: Options
): AsyncGenerator<File> {
  if (isFileSystemFile(entry)) {
    const file = extendFile(await resolveFileSystemFileEntry(entry), options);
    if (file) {
      yield file;
    }
  } else if (isFileSystemDirectory(entry)) {
    const baseDirectory = appendPath(options?.baseDirectory || "", entry.name);
    const entries = await resolveFileSystemDirectoryEntry(entry);
    for (const entry of entries) {
      yield* readFileSystemEntryRecursively(entry, {
        ...options,
        baseDirectory,
      });
    }
  }
}

const resolveFileSystemFileEntry = (
  entry: FileSystemFileEntry
): Promise<File | null> =>
  new Promise((resolve, reject) => entry.file(resolve, reject));

const resolveFileSystemDirectoryEntry = (
  entry: FileSystemDirectoryEntry
): Promise<FileSystemEntry[]> =>
  new Promise((resolve, reject) => {
    const reader = entry.createReader();
    reader.readEntries(resolve, reject);
  });

export const isFileSystemDirectory = (
  entry?: FileSystemEntry | null
): entry is FileSystemDirectoryEntry => entry?.isDirectory === true;

export const isFileSystemFile = (
  entry?: FileSystemEntry | null
): entry is FileSystemFileEntry => entry?.isFile === true;

export const isFileSystemDirectoryHandle = (
  handle?: FileSystemHandle | null
): handle is FileSystemDirectoryHandle => handle?.kind === "directory";

export const isFileSystemFileHanle = (
  handle?: FileSystemHandle | null
): handle is FileSystemFileHandle => handle?.kind === "file";
