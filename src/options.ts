export type FilterFn = (file: File) => boolean;

export interface Options {
  addDirectoryName?: boolean;
  baseDirectory?: string;
  enableFileSystemAccessAPI?: boolean;
  filters?: FilterFn[];
}
