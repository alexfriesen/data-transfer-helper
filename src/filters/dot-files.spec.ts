import { describe, it, expect } from "vitest";
import { dotFileFilter } from "./dot-files";

describe("dotFileFilter", () => {
  it("should return true if the file name does not start with a dot", () => {
    const file = new File([""], "file.txt");
    const result = dotFileFilter(file);
    expect(result).toStrictEqual(true);
  });

  it("should return false if the file name starts with a dot", () => {
    const file = new File([""], ".file.txt");
    const result = dotFileFilter(file);
    expect(result).toStrictEqual(false);
  });

  it("should return false if the file name starts with a dot and contains a path", () => {
    const file = new File([""], "test/.file.txt");
    const result = dotFileFilter(file);
    expect(result).toStrictEqual(false);
  });
});
