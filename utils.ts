import { log } from "./dev_deps.ts";

export interface WriteFileSecOptions extends Deno.WriteFileOptions {
  force?: boolean;
}

/**
 * Responsible for writing data to a file, but instead of overwriting by default
 * it gives a warning if the file already exists.
 *
 * If `force: true` is passed, the file will be (over)written in any case.
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
      log.warning(
        `File ${path} already exists. Use --force if you want to overwrite files.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}
