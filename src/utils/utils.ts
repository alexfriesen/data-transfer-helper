export async function generatorToArray<T>(
  generator: AsyncIterable<T>
): Promise<T[]> {
  const items: T[] = [];
  for await (const item of generator) items.push(item);
  return items;
}

export const appendPath = (base: string, path: string): string =>
  base + path + "/";
