// deno-lint-ignore no-explicit-any
export function ask(options: any) {
  const ts = prompt("Use TypeScript?", "y");

  const extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  let entrypoint = prompt(
    `Set entrypoint:`,
    `mod.${extension}`,
  );

  let depsEntrypoint = prompt(
    "Set dependency entrypoint:",
    `deps.${extension}`,
  );

  let devDepsEntrypoint = prompt(
    "Set dev dependency entrypoint:",
    `dev_deps.${extension}`,
  );

  if (!entrypoint || !depsEntrypoint || !devDepsEntrypoint) {
    throw new Error("Invalid entrypoint entered");
  }

  entrypoint = entrypoint.replace(new RegExp(`\.${extension}`), "");
  depsEntrypoint = depsEntrypoint.replace(new RegExp(`\.${extension}`), "");
  devDepsEntrypoint = devDepsEntrypoint.replace(
    new RegExp(`\.${extension}`),
    "",
  );

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
