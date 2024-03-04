import { describe, it, expect } from "vitest";
import { appendPath, generatorToArray } from "./utils";

describe("appendPath", () => {
  it("should append the given path to the base path", () => {
    const base = "base/";
    const path = "path";
    const result = appendPath(base, path);
    expect(result).toStrictEqual("base/path/");
  });
});

describe("generatorToArray", () => {
  it("should convert the generator to an array", async () => {
    const generator = (async function* () {
      yield 1;
      yield 2;
      yield 3;
    })();
    const result = await generatorToArray(generator);
    expect(result).toStrictEqual([1, 2, 3]);
  });
});
