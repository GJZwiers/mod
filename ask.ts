import { hasNoFileExtension } from "./utils.ts";

// deno-lint-ignore no-explicit-any
export function ask(options: any) {
  const ts = prompt("Use TypeScript?", "y");

  const extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  let entrypoint = prompt(
    `Set entrypoint:`,
    `mod.${extension}`,
  ) ?? "mod";

  let depsEntrypoint = prompt(
    "Set dependency entrypoint:",
    `deps.${extension}`,
  ) ?? "deps";

  let devDepsEntrypoint = prompt(
    "Set dev dependency entrypoint:",
    `dev_deps.${extension}`,
  ) ?? "dev_deps";

  let map = false;
  if (!options.importMap) {
    const importMap = prompt(
      "Add import map?",
      "n",
    );
    map = (importMap === "y" || importMap === "Y") ? true : false;
  }

  let config = false;
  if (!options.config) {
    const withConfig = prompt(
      "Add Deno configuration file?",
      "n",
    );
    config = (withConfig === "y" || withConfig === "Y") ? true : false;
  }

  if (hasNoFileExtension(entrypoint, extension)) {
    entrypoint = `${entrypoint}.${extension}`;
  }

  if (hasNoFileExtension(depsEntrypoint, extension)) {
    depsEntrypoint = `${depsEntrypoint}.${extension}`;
  }

  if (
    hasNoFileExtension(devDepsEntrypoint, extension)
  ) {
    devDepsEntrypoint = `${devDepsEntrypoint}.${extension}`;
  }

  const opts = {
    extension,
    entrypoint,
    depsEntrypoint,
    devDepsEntrypoint,
    map,
    config,
    ...options,
  };

  return opts;
}
