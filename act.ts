import { writeFileSec } from "./utils.ts";
import {
  defaultModuleContent,
  defaultTestModuleContent,
  Settings,
} from "./settings.ts";
import { asciiDeno } from "./ascii.ts";

export async function addProjectFile(filename: string, content: Uint8Array) {
  await writeFileSec(
    filename,
    content,
  );
}

export async function act(settings: Settings) {
  if (settings.name !== ".") {
    await Deno.mkdir(settings.name, { recursive: true });
  }

  if (settings.map === true) {
    await settings.addProjectFile(
      settings.name + "/import_map.json",
      settings.mapContent,
    );
  }

  if (settings.config || settings.configOnly) {
    await settings.addProjectFile(
      settings.name + "/deno.json",
      settings.configContent,
    );
  }

  if (!settings.configOnly) {
    await settings.addProjectFile(
      settings.name + "/" + settings.entrypoint,
      defaultModuleContent,
    );

    await settings.addProjectFile(
      settings.name + "/" + settings.depsEntrypoint,
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
        settings.name + "/" + testFileName,
        defaultTestModuleContent,
      );

      await settings.addProjectFile(
        settings.name + "/" + settings.devDepsEntrypoint,
        new TextEncoder().encode(
          'export { assert } from "https://deno.land/std@0.112.0/testing/asserts.ts"\n',
        ),
      );
    } else {
      await settings.addProjectFile(  
        settings.name + "/" + settings.devDepsEntrypoint,
        defaultModuleContent,
      );
    }

    if (settings.git) {
      await settings.initGit(settings.name);
    }

    await settings.addProjectFile(
      settings.name + "/" + settings.gitignore,
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

export async function initGit(name: string) {
  try {
    await runCommand(Deno.run({
      cmd: ["git", "init", name],
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
