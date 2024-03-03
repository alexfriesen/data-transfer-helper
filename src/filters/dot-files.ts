import { FilterFn } from "../options";

const getFileName = (value: string) => value.split("/").pop() || "";

export const dotFileFilter: FilterFn = (file) =>
  !getFileName(file.name).startsWith(".");
