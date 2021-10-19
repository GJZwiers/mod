import { mkdirSec, writeFileSec } from "./utils.ts";
import {
  defaultModuleContent,
  defaultTestModuleContent,
  settings,
} from "./settings.ts";

export async function act() {
  if (settings.path !== ".") {
    await mkdirSec(settings.path, { force: settings.force });
  }

  if (settings.map === true) {
    await writeFileSec(
      settings.path + "/import_map.json",
      settings.mapContent,
    );
  }

  if (settings.config === true || settings.configOnly === true) {
    await writeFileSec(
      settings.path + "/deno.json",
      settings.configContent,
    );
  }

  if (settings.configOnly !== true) {
    await writeFileSec(
      settings.path + "/" + settings.entrypoint,
      defaultModuleContent,
    );

    await writeFileSec(
      settings.path + "/" + settings.depsEntrypoint,
      defaultModuleContent,
    );

    await writeFileSec(
      settings.path + "/" + settings.devDepsEntrypoint,
      defaultModuleContent,
    );

    if (settings.testdriven === true) {
      const testFileName = settings.entrypoint.replace(
        /^(.*)\.ts$/,
        function (_fullmatch: string, p1: string): string {
          return p1 + ".test." + settings.extension;
        },
      );
      await writeFileSec(
        settings.path + "/" + testFileName,
        defaultTestModuleContent,
      );
    }

    if (settings.git === true) {
      await initGit(settings.path);
    }
  }
}

async function initGit(path: string) {
  try {
    await runCommand(Deno.run({
      cmd: ["git", "init", path],
    }));
  } catch (error) {
    console.warn(
      "Warning: Could not initialize Git repository. Error:" + error,
    );
  }

  await writeFileSec(
    settings.path + "/" + settings.gitignore,
    settings.gitignoreContent,
  );
}

// deno-lint-ignore no-explicit-any
export async function runCommand(cmd: any): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
