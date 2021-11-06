import { defaults } from "./settings.ts";
import { hasFileExtension } from "./utils.ts";

// deno-lint-ignore no-explicit-any
export function ask(options: any) {
  const ts = prompt("Use TypeScript?", "y");

  const extension = (ts === "y" || ts === "Y") ? "ts" : "js";
  console.log(extension);
  
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
  if (!options.map) {
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

  if (hasFileExtension(entrypoint, extension) === false) {
    console.log("Ha!");
    
    entrypoint = `${entrypoint}.${extension}`;
  }

  if (hasFileExtension(depsEntrypoint, extension) === false) {
    depsEntrypoint = `${depsEntrypoint}.${extension}`;
  }

  if (
    hasFileExtension(devDepsEntrypoint, extension) === false
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
