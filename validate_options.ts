import { Settings } from "./settings.ts";

export function validateOptions(options: Settings) {
  if (
    options.configOnly &&
    (options.tdd || options.prompt || options.ci || options.config ||
      options.importMap || options.js)
  ) {
    throw new Error(
      "Cannot use --config-only in combination with other options other than --name.",
    );
  }
}
