import { describe, it, expect } from "vitest";

import {
  isFileSystemDirectory,
  isFileSystemDirectoryHandle,
  isFileSystemFile,
  isFileSystemFileHanle,
  parseDataTransferItem,
  readFileSystemEntryAsync,
  readFileSystemHandlesAsync,
} from "./filesystem";
import {
  createMockDataTransferItem,
  createMockFileSystemDirectoryEntry,
  createMockFileSystemDirectoryHandle,
  createMockFileSystemFileEntry,
  createMockFileSystemFileHandle,
} from "./utils/testing";

describe("isFileSystemFileHanle", () => {
  it("should return true if the given FileSystemHandle is a file", () => {
    const handle = { kind: "file" } as FileSystemHandle;
    expect(isFileSystemFileHanle(handle)).toBeTruthy();
  });

  it("should return false if the given FileSystemHandle is a directory", () => {
    const handle = { kind: "directory" } as FileSystemHandle;
    expect(isFileSystemFileHanle(handle)).toBeFalsy();
  });
});

describe("isFileSystemDirectoryHandle", () => {
  it("should return true if the given FileSystemHandle is a directory", () => {
    const handle = { kind: "directory" } as FileSystemHandle;
    expect(isFileSystemDirectoryHandle(handle)).toBeTruthy();
  });

  it("should return false if the given FileSystemHandle is a file", () => {
    const handle = { kind: "file" } as FileSystemHandle;
    expect(isFileSystemDirectoryHandle(handle)).toBeFalsy();
  });
});

describe("isFileSystemFile", () => {
  it("should return true if the given FileSystemEntry is a file", () => {
    const entry = { isFile: true } as FileSystemEntry;
    expect(isFileSystemFile(entry)).toBeTruthy();
  });

  it("should return false if the given FileSystemEntry is a directory", () => {
    const entry = { isDirectory: true } as FileSystemEntry;
    expect(isFileSystemFile(entry)).toBeFalsy();
  });
});

describe("isFileSystemDirectory", () => {
  it("should return true if the given FileSystemEntry is a directory", () => {
    const entry = { isDirectory: true } as FileSystemEntry;
    expect(isFileSystemDirectory(entry)).toBeTruthy();
  });

  it("should return false if the given FileSystemEntry is a file", () => {
    const entry = { isFile: true } as FileSystemEntry;
    expect(isFileSystemDirectory(entry)).toBeFalsy();
  });
});

describe("parseDataTransferItem", () => {
  it("should return a File if the DataTransferItem is a File", async () => {
    const file = new File([""], "file.txt");
    const dataTransferItem = createMockDataTransferItem(file);
    const result = await parseDataTransferItem(dataTransferItem);
    expect(result).toStrictEqual([file]);
  });

  it("should return an empty array if no files are passed", async () => {
    const dataTransferItem = createMockDataTransferItem(null);
    const result = await parseDataTransferItem(dataTransferItem);
    expect(result).toStrictEqual([]);
  });

  it("should return a list of files via getAsEntry", async () => {
    const file = new File([""], "file.txt");
    const file2 = new File([""], "file2.txt");
    const hendle = createMockFileSystemDirectoryHandle("test", [
      createMockFileSystemFileHandle(file),
      createMockFileSystemFileHandle(file2),
    ]);
    const item = {
      getAsFileSystemHandle: () => Promise.resolve(hendle),
    } as DataTransferItem;
    const result = await parseDataTransferItem(item, {
      enableFileSystemAccessAPI: true,
    });
    expect(result).toStrictEqual([file, file2]);
  });

  it("should return a list of files via webkitGetAsEntry", async () => {
    const file = new File([""], "file.txt");
    const file2 = new File([""], "file2.txt");
    const entry = createMockFileSystemDirectoryEntry("test", [
      createMockFileSystemFileEntry(file),
      createMockFileSystemFileEntry(file2),
    ]);
    const item = { webkitGetAsEntry: () => entry } as DataTransferItem;
    const result = await parseDataTransferItem(item);
    expect(result).toStrictEqual([file, file2]);
  });

  it("should return a list of files via getAsEntry", async () => {
    const file = new File([""], "file.txt");
    const file2 = new File([""], "file2.txt");
    const entry = createMockFileSystemDirectoryEntry("test", [
      createMockFileSystemFileEntry(file),
      createMockFileSystemFileEntry(file2),
    ]);
    const item = { getAsEntry: () => entry } as any;
    const result = await parseDataTransferItem(item);
    expect(result).toStrictEqual([file, file2]);
  });
});

describe("readFileSystemEntryAsync", () => {
  it("should return a list of files", async () => {
    const file = new File([""], "file.txt");
    const file2 = new File([""], "file2.txt");
    const entry = createMockFileSystemDirectoryEntry("test", [
      createMockFileSystemFileEntry(file),
      createMockFileSystemFileEntry(file2),
    ]);

    const result = await readFileSystemEntryAsync(entry);
    expect(result).toStrictEqual([file, file2]);
  });

  it("should return a list of files and apply directory path", async () => {
    const file = new File(["123"], "file.txt");
    const entry = createMockFileSystemDirectoryEntry("test", [
      createMockFileSystemFileEntry(file),
    ]);

    const result = await readFileSystemEntryAsync(entry, {
      addDirectoryName: true,
    });
    expect(result).toStrictEqual([file]);
    expect(result[0].name).toEqual("test/file.txt");
  });
});

describe("readFileSystemHandlesAsync", () => {
  it("should return a list of files", async () => {
    const file = new File([""], "file.txt");
    const file2 = new File([""], "file2.txt");
    const handle = createMockFileSystemDirectoryHandle("test", [
      createMockFileSystemFileHandle(file),
      createMockFileSystemFileHandle(file2),
    ]);

    const result = await readFileSystemHandlesAsync(handle);
    expect(result).toStrictEqual([file, file2]);
  });

  it("should return a list of files and apply directory path", async () => {
    const file = new File(["123"], "file.txt");
    const handle = createMockFileSystemDirectoryHandle("test", [
      createMockFileSystemFileHandle(file),
    ]);

    const result = await readFileSystemHandlesAsync(handle, {
      addDirectoryName: true,
    });
    expect(result).toStrictEqual([file]);
    expect(result[0].name).toEqual("test/file.txt");
  });
});
