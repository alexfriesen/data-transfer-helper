export const supportsFileSystemAccessAPI =
  "getAsFileSystemHandle" in DataTransferItem.prototype;

export const supportsWebkitGetAsEntry =
  "webkitGetAsEntry" in DataTransferItem.prototype;
