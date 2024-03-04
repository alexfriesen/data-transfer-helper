import { describe, it, expect } from "vitest";
import { checkFile, extendFile, renameFile } from "./file";
import { dotFileFilter } from "../filters/dot-files";

describe("extendFile", () => {
  it("should return null if the file is null", () => {
    const result = extendFile(null);
    expect(result).toStrictEqual(null);
  });

  it("should return the file if no options are passed", () => {
    const file = new File([""], "file.txt");
    const result = extendFile(file);
    expect(result).toStrictEqual(file);
  });

  it("should return the file with the directory name if the option is set", () => {
    const file = new File([""], "file.txt");
    const options = { addDirectoryName: true, baseDirectory: "test/" };
    const result = extendFile(file, options);
    expect(result?.name).toStrictEqual("test/file.txt");
  });
});

describe("renameFile", () => {
  it("should return a new file with the given name", () => {
    const file = new File([""], "file.txt");
    const result = renameFile(file, "new.txt");
    expect(result.name).toStrictEqual("new.txt");
    expect(result.type).toStrictEqual(file.type);
    expect(result.lastModified).toStrictEqual(file.lastModified);
    expect(result.size).toStrictEqual(file.size);
    expect(result.arrayBuffer).toStrictEqual(file.arrayBuffer);
  });
});

describe("checkFile", () => {
  it("should return true if no filters are passed", () => {
    const file = new File([""], "file.txt");
    const result = checkFile(file);
    expect(result).toStrictEqual(true);
  });

  it("should return true if the file passes all filters", () => {
    const file = new File([""], "file.txt");
    const filter = () => true;
    const result = checkFile(file, { filters: [filter] });
    expect(result).toStrictEqual(true);
  });

  it("should return false if the file does not pass a filter", () => {
    const file = new File([""], "file.txt");
    const filter = () => false;
    const result = checkFile(file, { filters: [filter] });
    expect(result).toStrictEqual(false);
  });

  it("should return false if the file does not pass a filter", () => {
    const file = new File([""], ".file.txt");
    const result = checkFile(file, { filters: [dotFileFilter] });
    expect(result).toStrictEqual(false);
  });
});
