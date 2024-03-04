import { vi } from "vitest";

function dataTransferItem() {
  return {
    new: vi.fn(),
    prototype: {
      getAsFileSystemHandle: vi.fn(),
      webkitGetAsEntry: vi.fn(),
      getAsFile: vi.fn(),
    },
  };
}

globalThis.DataTransferItem =
  dataTransferItem as unknown as typeof DataTransferItem;
