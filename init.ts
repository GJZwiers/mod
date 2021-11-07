import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { defaults } from "./settings.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("mod")
  .version("v2.0.0")
  .description("Start a new Deno project with a single command")
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
    "-f, --force [force:boolean]",
    "Force overwrite of existing files/directories. Helpful to re-initialize, but use with caution!",
  )
  .option(
    "-m, --import-map [importMap:boolean]",
    "Add an import map as part of the project.",
    {
      default: false,
    },
  )
  .option(
    "--no-git [git:boolean]",
    "Do not initialize a local Git repository for the project.",
  )
  .option(
    "-n, --name [name:string]",
    "Create the project in a new directory with the entered name.",
  )
  .option(
    "-t, --tdd [tdd:boolean]",
    "Create the project with a file for tests.",
    {
      default: false,
    },
  )
  .option(
    "-p, --prompt [prompt:boolean]",
    "Answer a series of prompts in order to set up the module.",
    {
      default: false,
    },
  )
  .option(
    "-a, --ascii [ascii:boolean]",
    "Initialize an ASCII Deno to the screen!",
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
  })
  .example(
    "Start a test-driven project",
    "mod --tdd",
  )
  .example(
    "Create a project with an import map and deno configuration file",
    "mod --import-map --config",
  )
  .parse(Deno.args);
