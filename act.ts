import { writeFileSec } from "./utils.ts";
import {
  defaultModuleContent,
  defaultTestImportContent,
  defaultTestModuleContent,
  Settings,
} from "./settings.ts";
import { asciiDeno } from "./ascii.ts";

export async function addProjectFile(filename: string, content: Uint8Array) {
  await writeFileSec(filename, content);
}

export async function act(settings: Settings) {
  const path = settings.name;
  if (path !== ".") {
    await Deno.mkdir(path, { recursive: true });
  }

  if (settings.map) {
    await settings.addProjectFile(
      `${path}/import_map.json`,
      settings.mapContent,
    );
  }

  if (settings.config || settings.configOnly) {
    await settings.addProjectFile(
      `${path}/deno.json`,
      settings.configContent,
    );
  }

  if (!settings.configOnly) {
    await settings.addProjectFile(
      `${path}/${settings.entrypoint}`,
      defaultModuleContent,
    );

    await settings.addProjectFile(
      `${path}/${settings.depsEntrypoint}`,
      defaultModuleContent,
    );

    if (settings.tdd) {
      const testFileName = settings.entrypoint.replace(
        /^(.*)\.(?:ts|js)$/,
        function (_fullmatch: string, p1: string): string {
          return p1 + ".test." + settings.extension;
        },
      );
      await settings.addProjectFile(
        `${path}/${testFileName}`,
        defaultTestModuleContent,
      );

      await settings.addProjectFile(
        `${path}/${settings.devDepsEntrypoint}`,
        defaultTestImportContent,
      );
    } else {
      await settings.addProjectFile(
        `${path}/${settings.devDepsEntrypoint}`,
        defaultModuleContent,
      );
    }

    if (settings.git) {
      await settings.initGit(path);
    }

    await settings.addProjectFile(
      `${path}/${settings.gitignore}`,
      settings.gitignoreContent,
    );

    if (settings.ascii) {
      const lines = asciiDeno.split(/\n/);
      let i = 0;
      for (const line of lines) {
        i += 50;
        setTimeout(() => {
          console.log(line);
        }, 250 + i);
      }
    }
  }
}

export async function initGit(path: string) {
  try {
    await runCommand(Deno.run({
      cmd: ["git", "init", path],
    }));
  } catch (error) {
    console.warn(
      "Warning: Could not initialize Git repository. Error:" + error,
    );
  }
}

// deno-lint-ignore no-explicit-any
export async function runCommand(cmd: any): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
