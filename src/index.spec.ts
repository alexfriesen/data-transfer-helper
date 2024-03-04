import { describe, it, expect } from "vitest";

import { parseDataTransferFiles, parseFilesFromEvent } from "./index.ts";
import {
  createMockDataTransfer,
  createMockDataTransferEvent,
  createMockDataTransferList,
} from "./utils/testing";

describe("parseDataTransferFiles", () => {
  it("should return an empty array if the list is undefined", async () => {
    const result = await parseDataTransferFiles(undefined);
    expect(result).toStrictEqual([]);
  });

  it("should return an empty array if the list is empty", async () => {
    const result = await parseDataTransferFiles(
      [] as unknown as DataTransferItemList
    );
    expect(result).toStrictEqual([]);
  });

  it("should return an empty array if the list contains no files", async () => {
    const result = await parseDataTransferFiles([
      { kind: "not file" },
    ] as unknown as DataTransferItemList);
    expect(result).toStrictEqual([]);
  });

  it("should return a list of files", async () => {
    const file = new File([""], "file.txt");
    const list = createMockDataTransferList([file]);
    const result = await parseDataTransferFiles(list);
    expect(result).toStrictEqual([file]);
  });
});

describe("parseFilesFromEvent", () => {
  it("should return an empty array if the event has no dataTransfer", async () => {
    const event = createMockDataTransferEvent("drop", []);
    const result = await parseFilesFromEvent(event);
    expect(result).toStrictEqual([]);
  });

  it("should return an empty array if the dataTransfer has no items", async () => {
    const dataTransfer = createMockDataTransfer([]);
    const event = new Event("drop");
    Object.assign(event, { dataTransfer });
    const result = await parseFilesFromEvent(event as DragEvent);
    expect(result).toStrictEqual([]);
  });

  it("should return a list of files", async () => {
    const file = new File([""], "file.txt");
    const event = createMockDataTransferEvent("drop", [file]);
    const result = await parseFilesFromEvent(event);
    expect(result).toStrictEqual([file]);
  });
});
