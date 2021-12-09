import { Settings } from "./settings.ts";

/**
 * Enable the user to override default settings with a couple of prompts.
 */
export function ask(settings: Settings): Settings {
  // Apply modifications to a clone of the settings object for isolation purposes.
  const userSettings: Settings = self.structuredClone(settings);

  // TODO: dont prompt if --js flag is passed.
  const ts = prompt("Use TypeScript?", "y");

  userSettings.extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  const entrypoint = prompt(
    `Set entrypoint:`,
    `mod.${userSettings.extension}`,
  );

  const depsEntrypoint = prompt(
    "Set dependency entrypoint:",
    `deps.${userSettings.extension}`,
  );

  const devDepsEntrypoint = prompt(
    "Set dev dependency entrypoint:",
    `dev_deps.${userSettings.extension}`,
  );

  if (!entrypoint || !depsEntrypoint || !devDepsEntrypoint) {
    throw new Error("One or more entrypoint inputs are empty.");
  }

  const hasFileExtension = new RegExp(`\.${userSettings.extension}$`);

  userSettings.entrypoint = entrypoint.replace(hasFileExtension, "");
  userSettings.depsEntrypoint = depsEntrypoint.replace(hasFileExtension, "");
  userSettings.devDepsEntrypoint = devDepsEntrypoint.replace(
    hasFileExtension,
    "",
  );

  if (!userSettings.importMap) {
    const importMap = prompt(
      "Add import map?",
      "n",
    );
    userSettings.importMap = (importMap === "y" || importMap === "Y")
      ? true
      : false;
  }

  if (!userSettings.config) {
    const withConfig = prompt(
      "Add Deno configuration file?",
      "n",
    );
    userSettings.config = (withConfig === "y" || withConfig === "Y")
      ? true
      : false;
  }

  return userSettings;
}
