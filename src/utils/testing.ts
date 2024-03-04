export const createMockDataTransferItem = (file: File | null, kind = "file") =>
  ({
    kind,
    type: file?.type,
    getAsFile: () => file,
  } as unknown as DataTransferItem);

export const createMockDataTransferList = (files: File[]) =>
  files.map((file) =>
    createMockDataTransferItem(file)
  ) as unknown as DataTransferItemList;

export const createMockDataTransfer = (files: File[]) => {
  const items = createMockDataTransferList(files);

  return {
    items,
    types: ["Files"],
  } as unknown as DataTransfer;
};

export const createMockDataTransferEvent = (
  eventType: string,
  files: File[]
): DragEvent => {
  const dataTransfer = createMockDataTransfer(files);
  const event = new Event(eventType, { bubbles: true });
  Object.assign(event, { dataTransfer });
  return event as DragEvent;
};

export const createMockFileSystemDirectoryEntry = (
  name: string,
  values: FileSystemEntry[] = []
): FileSystemEntry => {
  return {
    isFile: false,
    isDirectory: true,
    name,
    createReader: () => {
      return {
        readEntries: (resolve) => {
          resolve(values);
        },
      };
    },
  } as unknown as FileSystemDirectoryEntry;
};

export const createMockFileSystemFileEntry = (file: File): FileSystemEntry => {
  return {
    isFile: true,
    isDirectory: false,
    file: (resolve) => resolve(file),
  } as unknown as FileSystemFileEntry;
};

export const createMockFileSystemDirectoryHandle = (
  name: string,
  values: FileSystemHandle[] = []
): FileSystemHandle => {
  return {
    kind: "directory",
    name,
    values: () => values,
  } as unknown as FileSystemDirectoryHandle;
};

export const createMockFileSystemFileHandle = (
  file: File
): FileSystemHandle => {
  return {
    kind: "file",
    getFile: () => Promise.resolve(file),
  } as unknown as FileSystemFileHandle;
};
