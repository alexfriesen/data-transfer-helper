# data-transfer-helper

[![npm][badge-npm-version]][url-npm]
[![MIT licensed][badge-licence]][url-licence]
[![Size][badge-bundle]][url-bundle]

Helper Function for handling DnD DataTransfer Events.

Fetures:

- parse dropped directories via File System Access API or webkitGetAsEntry
- blazing fast generator functions
- small bundle size
- no dependencies
- filter files
- typescript support

## Getting started:

install the package:

```bash
npm install data-transfer-helper
```

And use it in your code:

```typescript
import { parseFilesFromEvent } from "data-transfer-helper";

document.addEventListener("drop", async function (event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const files = await parseFilesFromEvent(event);
});
```

## Options:

### filters:

You can provide a filter function to filter the files that are returned.

```typescript
import { parseFilesFromEvent, dotFileFilter } from "data-transfer-helper";

document.addEventListener("drop", async function (event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const files = await parseFilesFromEvent(event, {
    filters: [dotFileFilter, (file: File) => file.size < 1000000],
  });
  // files will only contain files that are not dot files and are smaller than 1MB
});
```

### addDirectoryName:

You can provide a flag to add directory paths to filenames.

```typescript
import { parseFilesFromEvent } from "data-transfer-helper";

document.addEventListener("drop", async function (event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const files = await parseFilesFromEvent(event, {
    addDirectoryName: true,
  });
  // files will contain the full path to the file
  // e.g. Downloads/file.txt
});
```

### enableFileSystemAccessAPI

You can provide a flag to enable the experimetal [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle).


```typescript
import { parseFilesFromEvent } from "data-transfer-helper";

document.addEventListener("drop", async function (event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const files = await parseFilesFromEvent(event, {
    enableFileSystemAccessAPI: true,
  });
  // files will fallback to webkitGetAsEntry and getFile()
});
```

[url-npm]: https://www.npmjs.com/package/data-transfer-helper
[url-bundle]: https://img.shields.io/bundlephobia/minzip/data-transfer-helper
[badge-bundle]: https://img.shields.io/bundlephobia/minzip/data-transfer-helper
[url-licence]: https://github.com/data-transfer-helper/blob/master/LICENSE
[badge-licence]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-npm-version]: https://img.shields.io/npm/v/data-transfer-helper.svg?style=flat-square
[badge-npm-downloads]: https://img.shields.io/npm/dm/data-transfer-helper.svg?style=flat-square
