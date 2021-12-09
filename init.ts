import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { settings } from "./settings.ts";
import { ask } from "./ask.ts";
import { validateOptions } from "./validate_options.ts";

await new Command()
  .name("mod")
  .version("v2.2.9")
  .description("Start a new Deno module with a single command")
  .option(
    "--js [js:boolean]",
    "Use JavaScript instead of TypeScript for the module",
    {
      default: false,
    },
  )
  .option(
    "-n, --name [name:string]",
    "Create the module in a new directory with the entered name.",
  )
  .option(
    "-p, --prompt [prompt:boolean]",
    "Create the module through a series of prompts. This is useful if you want to override defaults, such as choose 'main.ts' instead of 'mod.ts' as the entrypoint.",
    {
      default: false,
    },
  )
  .option(
    "--ci [ci:boolean]",
    "Add a GitHub Actions CI workflow to the module.",
    {
      default: false,
    },
  )
  .option(
    "-t, --tdd [tdd:boolean]",
    "Add a .test file to the module. Note: std/testing won't be cached automatically.",
    {
      default: false,
    },
  )
  .option(
    "-c, --config [config:boolean]",
    "Add a deno.json configuration file to the module.",
    {
      default: false,
    },
  )
  .option(
    "-o, --config-only [configOnly:boolean]",
    "Only add a deno.json configuration file and no other files to the module.",
    {
      default: false,
    },
  )
  .option(
    "-m, --import-map [importMap:boolean]",
    "Add an import_map.json to the module.",
    {
      default: false,
    },
  )
  .option(
    "-f, --force [force:boolean]",
    "Force overwrite of existing files/directories. Use with caution!",
  )
  .option(
    "--no-git [git:boolean]",
    "Don't initialize a local Git repository for the module.",
  )
  .option(
    "-a, --ascii [ascii:boolean]",
    "Draw an ASCII Deno to the screen after module creation succeeds!",
    {
      default: false,
    },
  )
  .action((options) => {
    validateOptions(options);

    if (options.prompt) {
      const choices = ask(options);
      act({ ...settings, ...choices });
    } else {
      act({ ...settings, ...options });
    }
  })
  .help({
    hints: false,
    colors: false,
  })
  .example(
    "Start a test-driven module",
    "mod --tdd",
  )
  .example(
    "Use JavaScript instead of TypeScript",
    "mod --js",
  )
  .example(
    "Include a CI pipeline (GitHub Actions)",
    "mod --ci",
  )
  .example(
    "Add an import map and deno configuration file",
    "mod --import-map --config",
  )
  .parse(Deno.args);
