import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { defaults } from "./settings.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("mod")
  .version("v2.2.3")
  .description("Start a new Deno project with a single command")
  .option(
    "--js [js:boolean]",
    "Use JavaScript instead of TypeScript for the module",
    {
      default: false,
    },
  )
  .option(
    "-n, --name [name:string]",
    "Create the project in a new directory with the entered name.",
  )
  .option(
    "-p, --prompt [prompt:boolean]",
    "Answer a series of prompts in order to set up the module.",
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
    "Create the project with a file for tests. Note: std/testing won't be cached automatically.",
    {
      default: false,
    },
  )
  .option(
    "-c, --config [config:boolean]",
    "Add a deno.json configuration file as part of the project.",
    {
      default: false,
    },
  )
  .option(
    "-o, --config-only [configOnly:boolean]",
    "Only make a deno.json configuration file.",
    {
      default: false,
    },
  )
  .option(
    "-m, --import-map [importMap:boolean]",
    "Add an import map as part of the project.",
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
    "Don't initialize a local Git repository for the project.",
  )
  .option(
    "-a, --ascii [ascii:boolean]",
    "Draw an ASCII Deno to the screen after module creation succeeds!",
    {
      default: false,
    },
  )
  .action((options) => {
    if (options.prompt) {
      const choices = ask(options);
      act({ ...defaults, ...choices });
    } else {
      act({ ...defaults, ...options });
    }
  })
  .help({
    hints: false,
    colors: false,
  })
  .example(
    "Start a test-driven project",
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
