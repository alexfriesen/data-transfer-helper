import { resolveFileName } from "../utils/file";
import { FilterFn } from "../options";

export const dotFileFilter: FilterFn = (file) =>
  !resolveFileName(file.name).startsWith(".");
