# data-transfer-helper
Helper Function for handling DnD DataTransfer Events

## Example:
```typescript
import { parseFilesFromEvent } from 'data-transfer-helper';

document.addEventListener('drop', async function(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = await parseFilesFromEvent(event);
});
```
