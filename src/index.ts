import { Options } from "./options";
import { parseDataTransferItem } from "./filesystem";

export async function parseDataTransferFiles(
  list: DataTransferItemList | undefined,
  options?: Options
) {
  if (list) {
    const items = Array.from(list).filter((item) => item.kind === "file");
    const fileChunks = await Promise.all(
      items.map(async (item) => parseDataTransferItem(item, options))
    );
    return fileChunks.flat();
  }

  return [];
}

export async function parseFilesFromEvent(event: DragEvent, options?: Options) {
  const list = event.dataTransfer?.items;
  return parseDataTransferFiles(list, options);
}
