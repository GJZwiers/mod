import { writeFileSec, WriteFileSecOptions } from "./utils.ts";
import {
  defaultModuleContent,
  defaultTestImportContent,
  defaultTestModuleContent,
  Settings,
} from "./settings.ts";
import { asciiDeno } from "./ascii.ts";

export async function addProjectFile(
  filename: string,
  content: Uint8Array,
  options?: WriteFileSecOptions,
) {
  await writeFileSec(filename, content, options);
}

export async function act(settings: Settings) {
  const path = settings.name;
  if (path !== ".") {
    await Deno.mkdir(path, { recursive: true });
  }

  if (settings.importMap) {
    await settings.addProjectFile(
      `${path}/import_map.json`,
      settings.mapContent,
      { force: settings.force },
    );
  }

  if (settings.config || settings.configOnly) {
    await settings.addProjectFile(
      `${path}/deno.json`,
      settings.configContent,
      { force: settings.force },
    );
  }

  if (!settings.configOnly) {
    await settings.addProjectFile(
      `${path}/${settings.entrypoint}`,
      defaultModuleContent,
      { force: settings.force },
    );

    await settings.addProjectFile(
      `${path}/${settings.depsEntrypoint}`,
      defaultModuleContent,
      { force: settings.force },
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
        { force: settings.force },
      );

      await settings.addProjectFile(
        `${path}/${settings.devDepsEntrypoint}`,
        defaultTestImportContent,
        { force: settings.force },
      );
    } else {
      await settings.addProjectFile(
        `${path}/${settings.devDepsEntrypoint}`,
        defaultModuleContent,
        { force: settings.force },
      );
    }

    if (settings.git) {
      await settings.initGit(path);
    }

    await settings.addProjectFile(
      `${path}/${settings.gitignore}`,
      settings.gitignoreContent,
      { force: settings.force },
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

export async function runCommand(
  cmd: Deno.Process<{
    cmd: string[] | [URL, ...string[]];
  }>,
): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
