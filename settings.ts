import { YAML } from "./deps.ts";

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
  ci: boolean;
  prompt: boolean;
}

export interface FileNameSettings {
  depsEntrypoint: string;
  devDepsEntrypoint: string;
  entrypoint: string;
  gitignore: string;
}

export interface Settings
  extends FlagSettings, FileContentSettings, FileNameSettings {
  extension: string;
  name: string;
}

const encoder = new TextEncoder();

export const defaultModuleContent = encoder.encode("export {};\n");

export const settings: Settings = {
  ascii: false,
  config: false,
  configContent: encoder.encode(
    `{
  "compilerOptions": {},
  "fmt": {
    "files": {
      "include": [],
      "exclude": []
    },
    "options": {}
  },
  "lint": {
    "files": {
      "include": [],
      "exclude": []
    },
    "rules": {
      "include": [],
      "exclude": []
    }
  }
}`,
  ),
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
cov/
coverage/
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
  js: false,
  ci: false,
  prompt: false,
};

export const defaultTestModuleContent = encoder.encode(
  `import { assert } from "./{{devDepsEntrypoint}}.{{extension}}"; 

Deno.test({
  name: "name",
  fn() {
    assert(true);
  }
});\n`,
);

export const defaultTestImportContent = encoder.encode(
  'export { assert } from "https://deno.land/std@0.152.0/testing/asserts.ts";\n',
);

export const actions = encoder.encode(YAML.stringify({
  name: "build",
  on: "push",
  jobs: {
    build: {
      "runs-on": "${{ matrix.os }}",
      strategy: {
        matrix: {
          os: ["ubuntu-22.04"],
        },
      },
      steps: [
        {
          uses: "actions/checkout@v2",
        },
        {
          uses: "denoland/setup-deno@v1.1.0",
          with: {
            "deno-version": "v1.x.x",
          },
        },
        {
          run: "deno fmt --check",
        },
        {
          run: "deno lint",
        },
        {
          run: "deno test -A --coverage=cov",
        },
      ],
    },
  },
}));
