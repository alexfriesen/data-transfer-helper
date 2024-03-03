export type FilterFn = (file: File) => boolean;

export interface Options {
  addDirectoryName?: boolean;
  baseDirectory?: string;
  disableFileSystemAccessAPI?: boolean;
  filters?: FilterFn[];
}
