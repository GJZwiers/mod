// deno-lint-ignore no-explicit-any
export function validateOptions(options: any) {
  if (
    options.configOnly &&
    (options.tdd || options.prompt || options.ci || options.config ||
      options.importMap || options.js)
  ) {
    throw new Error(
      "Cannot use config-only flag in combination with other options other than --name.",
    );
  }
}
