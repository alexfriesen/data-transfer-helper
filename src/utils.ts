import { Options } from "./options";

export const renameFile = (file: File, name: string): File => {
  const renamed = new File([file], name, {
    type: file.type,
    lastModified: file.lastModified,
  });
  return renamed;
};

export async function generatorToArray<T>(
  generator: AsyncIterable<T>
): Promise<T[]> {
  const items: T[] = [];
  for await (const item of generator) items.push(item);
  return items;
}

export const appendPath = (base: string, path: string): string =>
  base + path + "/";

export const extendFile = (file: File | null, options?: Options) => {
  if (file && options?.addDirectoryName) {
    const filename = options.baseDirectory + file.name;
    return renameFile(file, filename);
  }

  return file;
};

export const supportsFileSystemAccessAPI =
  "getAsFileSystemHandle" in DataTransferItem.prototype;
export const supportsWebkitGetAsEntry =
  "webkitGetAsEntry" in DataTransferItem.prototype;
