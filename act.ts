import { log } from "./dev_deps.ts";
import { writeFileSec } from "./utils.ts";
import {
  actions,
  defaultModuleContent,
  defaultTestImportContent,
  defaultTestModuleContent,
  Settings,
} from "./settings.ts";

export const fns = {
  writeFileSec,
  initGit,
};

/**
 * Responsible for calling `git init` in a directory. The function wrap is mainly to improve testability.
 */
async function initGit(path: string) {
  try {
    const cmd = Deno.run({
      cmd: ["git", "init", path],
    });

    const status = await cmd.status();
    cmd.close();

    return status.code === 0;
  } catch (error) {
    log.warning(
      "Could not initialize Git repository. Error: " + error,
    );
    return false;
  }
}

/**
 * This function is responsible for creating the module's contents using user-provided settings or defaults.
 */
export async function act(settings: Settings) {
  const path = settings.name;

  if (path !== "." && path !== "./") {
    await Deno.mkdir(path, { recursive: true });
  }

  if (settings.configOnly) {
    return await fns.writeFileSec(
      `${path}/deno.json`,
      settings.configContent,
      { force: settings.force },
    );
  }

  if (settings.ci) {
    const actionsPath = `${path}/.github/workflows`;
    await Deno.mkdir(actionsPath, { recursive: true });

    await fns.writeFileSec(
      `${actionsPath}/build.yaml`,
      actions,
    );
  }

  if (settings.config) {
    await fns.writeFileSec(
      `${path}/deno.json`,
      settings.configContent,
      { force: settings.force },
    );
  }

  if (settings.js) settings.extension = "js";

  await fns.writeFileSec(
    `${path}/${settings.gitignore}`,
    settings.gitignoreContent,
    { force: settings.force },
  );

  if (settings.importMap) {
    await fns.writeFileSec(
      `${path}/import_map.json`,
      settings.mapContent,
      { force: settings.force },
    );
  }

  await fns.writeFileSec(
    `${path}/${settings.entrypoint}.${settings.extension}`,
    defaultModuleContent,
    { force: settings.force },
  );

  await fns.writeFileSec(
    `${path}/${settings.depsEntrypoint}.${settings.extension}`,
    defaultModuleContent,
    { force: settings.force },
  );

  if (settings.tdd) {
    const testModBytes = new TextEncoder().encode(
      new TextDecoder()
        .decode(defaultTestModuleContent)
        .replace(
          /\{\{extension\}\}/,
          settings.extension,
        )
        .replace(
          /\{\{devDepsEntrypoint\}\}/,
          settings.devDepsEntrypoint,
        ),
    );

    await fns.writeFileSec(
      `${path}/${settings.entrypoint}.test.${settings.extension}`,
      testModBytes,
      { force: settings.force },
    );

    await fns.writeFileSec(
      `${path}/${settings.devDepsEntrypoint}.${settings.extension}`,
      defaultTestImportContent,
      { force: settings.force },
    );
  } else {
    await fns.writeFileSec(
      `${path}/${settings.devDepsEntrypoint}.${settings.extension}`,
      defaultModuleContent,
      { force: settings.force },
    );
  }

  if (settings.git) {
    await fns.initGit(path);
  }
}
