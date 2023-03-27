import { parseDataTransferItem } from "./filesystem";

export async function parseDataTransferFiles(
  list: DataTransferItemList | undefined
) {
  if (list) {
    const items = Array.from(list).filter((item) => item.kind === "file");
    const fileChunks = await Promise.all(
      items.map(async (item) => parseDataTransferItem(item))
    );
    return fileChunks.flat();
  }

  return [];
}

export async function parseFilesFromEvent(event: DragEvent) {
  const list = event.dataTransfer?.items;
  return parseDataTransferFiles(list);
}
