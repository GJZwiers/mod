export interface WriteFileSecOptions extends Deno.WriteFileOptions {
  force?: boolean;
}

/**
 * Attempts to write to a file, but warns instead of overwrites if it already exists.
 */
export async function writeFileSec(
  path: string | URL,
  data: Uint8Array,
  options?: WriteFileSecOptions,
): Promise<void> {
  if (options?.force) {
    return await Deno.writeFile(path, data, options);
  }

  try {
    const file = await Deno.readFile(path);
    if (file) {
      console.warn(
        `Warning: file ${path} already exists. Use --force if you want to overwrite files.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}

export function hasNoFileExtension(
  filename: string,
  extension: string,
): boolean {
  return !new RegExp(`\.${extension}$`).test(filename);
}
