import { Options } from "../options";

export const resolveFileName = (value: string | undefined) =>
  value?.split("/").pop() || "";

export const renameFile = (file: File, name: string): File => {
  const renamed = new File([file], name, {
    type: file.type,
    lastModified: file.lastModified,
  });
  return renamed;
};

export const extendFile = (file: File | null, options?: Options) => {
  if (file && options?.addDirectoryName) {
    const filename = options.baseDirectory + file.name;
    return renameFile(file, filename);
  }

  return file;
};

export const checkFile = (file: File, options?: Options) => {
  if (options?.filters) {
    for (const filter of options.filters) {
      if (!filter(file)) return false;
    }
  }

  return true;
};
