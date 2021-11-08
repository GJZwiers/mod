import { addProjectFile, initGit } from "./act.ts";
import { WriteFileSecOptions } from "./utils.ts";

export interface FileContentSettings {
  configContent: Uint8Array;
  depsModuleContent: Uint8Array;
  gitignoreContent: Uint8Array;
  mapContent: Uint8Array;
  moduleContent: Uint8Array;
}

export interface FlagSettings {
  ascii: boolean;
  config: boolean;
  configOnly: boolean;
  force: boolean;
  git: boolean;
  importMap: boolean;
  tdd: boolean;
  js: boolean;
}

export interface InsertableTestSpies {
  initGit: (name: string) => Promise<void>;
  addProjectFile: (
    filename: string,
    content: Uint8Array,
    options?: WriteFileSecOptions,
  ) => Promise<void>;
}

export interface FileNameSettings {
  depsEntrypoint: string;
  devDepsEntrypoint: string;
  entrypoint: string;
  gitignore: string;
}

export interface Settings
  extends
    FlagSettings,
    FileContentSettings,
    FileNameSettings,
    InsertableTestSpies {
  extension: string;
  name: string;
}

const encoder = new TextEncoder();

export const defaultModuleContent = encoder.encode("export {};\n");

export const defaults: Settings = {
  ascii: false,
  config: false,
  configContent: encoder.encode("{\n\t\n}"),
  configOnly: false,
  extension: "ts",
  entrypoint: "mod",
  depsEntrypoint: "deps",
  devDepsEntrypoint: "dev_deps",
  depsModuleContent: defaultModuleContent,
  force: false,
  git: true,
  gitignore: ".gitignore",
  gitignoreContent: encoder.encode(
    `.env
.vscode/
coverage/
cov/
lcov/
target/`,
  ),
  moduleContent: defaultModuleContent,
  name: ".",
  importMap: false,
  mapContent: encoder.encode(
    `{
  "imports": {}
}
`,
  ),
  tdd: false,
  initGit: initGit,
  addProjectFile: addProjectFile,
  js: false,
};

export const defaultTestModuleContent = encoder.encode(
  `import { assert } from "./${defaults.devDepsEntrypoint}.{{extension}}"; 

Deno.test({
  name: "name",
  fn() {
    assert(true);
  }
});\n`,
);

export const defaultTestImportContent = encoder.encode(
  'export { assert } from "https://deno.land/std@0.112.0/testing/asserts.ts";\n',
);
