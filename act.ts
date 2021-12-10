import { writeFileSec, WriteFileSecOptions } from "./utils.ts";
import {
  actions,
  defaultModuleContent,
  defaultTestImportContent,
  defaultTestModuleContent,
  Settings,
} from "./settings.ts";
import { asciiDeno } from "./ascii.ts";
import { log } from "./dev_deps.ts";

export async function act(settings: Settings) {
  const path = settings.name;
  if (path !== "." && path !== "./") {
    await Deno.mkdir(path, { recursive: true });
  }

  if (settings.configOnly) {
    await funcs.addModuleFile(
      `${path}/deno.json`,
      settings.configContent,
      { force: settings.force },
    );
    if (settings.ascii) drawDeno();
    return;
  }

  if (settings.js) settings.extension = "js";

  if (settings.config) {
    await funcs.addModuleFile(
      `${path}/deno.json`,
      settings.configContent,
      { force: settings.force },
    );
  }

  if (settings.importMap) {
    await funcs.addModuleFile(
      `${path}/import_map.json`,
      settings.mapContent,
      { force: settings.force },
    );
  }

  await funcs.addModuleFile(
    `${path}/${settings.entrypoint}.${settings.extension}`,
    defaultModuleContent,
    { force: settings.force },
  );

  await funcs.addModuleFile(
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
        ),
    );

    await funcs.addModuleFile(
      `${path}/${settings.entrypoint}.test.${settings.extension}`,
      testModBytes,
      { force: settings.force },
    );

    await funcs.addModuleFile(
      `${path}/${settings.devDepsEntrypoint}.${settings.extension}`,
      defaultTestImportContent,
      { force: settings.force },
    );
  } else {
    await funcs.addModuleFile(
      `${path}/${settings.devDepsEntrypoint}.${settings.extension}`,
      defaultModuleContent,
      { force: settings.force },
    );
  }

  if (settings.ci) {
    const actionsPath = `${path}/.github/workflows`;
    await Deno.mkdir(actionsPath, { recursive: true });

    await funcs.addModuleFile(
      `${actionsPath}/build.yaml`,
      actions,
    );
  }

  if (settings.git) {
    await funcs.initGit(path);
  }

  await funcs.addModuleFile(
    `${path}/${settings.gitignore}`,
    settings.gitignoreContent,
    { force: settings.force },
  );

  if (settings.ascii) {
    drawDeno();
  }
}

async function addModuleFile(
  filename: string,
  content: Uint8Array,
  options?: WriteFileSecOptions,
) {
  await writeFileSec(filename, content, options);
}

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

function drawDeno() {
  const lines = asciiDeno.split(/\n/);
  let i = 0;
  for (const line of lines) {
    i += 50;
    setTimeout(() => {
      console.log(line);
    }, 250 + i);
  }
}

export const funcs = {
  addModuleFile,
  initGit,
};
