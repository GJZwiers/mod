import { assert, assertEquals, assertThrows, sinon } from "./dev_deps.ts";
import { act, funcs } from "./act.ts";
import { defaults } from "./settings.ts";

Deno.test("runCommand()", async (test) => {
  defaults.name = "test_directory";

  await test.step(
    "return true if git initialization succeeds",
    async () => {
      Deno.mkdirSync(defaults.name, { recursive: true });
      assertEquals(await funcs.initGit(defaults.name), true);
      Deno.removeSync(defaults.name, { recursive: true });
    },
  );
});

Deno.test("act()", async (context) => {
  defaults.name = "test_directory_act";

  const fileSpy = sinon.spy(funcs, "addModuleFile");

  const gitSpy = sinon.spy(funcs, "initGit");

  const beforeEach = () => {
    Deno.mkdirSync(defaults.name, { recursive: true });
  };

  const afterEach = () => {
    Deno.removeSync(defaults.name, { recursive: true });

    defaults.config = false;
    defaults.configOnly = false;
    defaults.git = false;
    defaults.importMap = false;
    defaults.tdd = false;
    defaults.ci = false;

    fileSpy.resetHistory();
    gitSpy.resetHistory();
  };

  const test = async (
    options: Deno.TestDefinition,
  ) => {
    beforeEach();

    await context.step(options);

    afterEach();
  };

  const standardFiles = ["mod.ts", "deps.ts", "dev_deps.ts", ".gitignore"];

  await test({
    name: "initialize git if settings.git is true",
    fn: async () => {
      defaults.git = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 1);
      assertEquals(fileSpy.getCalls().length, standardFiles.length);

      assert(`${defaults.name}/.git`);
    },
  });

  await test({
    name: "create import_map.json if settings.importMap is true",
    fn: async () => {
      defaults.importMap = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const mapFile = Deno.readFileSync(
        `${defaults.name}/import_map.json`,
      );

      assert(mapFile);
    },
  });

  await test({
    name: "create deno.json if settings.config is true",
    fn: async () => {
      defaults.config = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const configFile = Deno.readFileSync(
        `${defaults.name}/deno.json`,
      );

      assert(configFile);
    },
  });

  await test({
    name: "create .test file for module entrypoint if settings.tdd is true",
    fn: async () => {
      defaults.tdd = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const testFile = Deno.readFileSync(
        `${defaults.name}/mod.test.ts`,
      );

      assert(testFile);
    },
  });

  await test({
    name: "create .js files when settings.js is true",
    fn: async () => {
      defaults.js = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length);

      assert(
        Deno.readFileSync(`${defaults.name}/mod.js`),
      );
      assert(
        Deno.readFileSync(`${defaults.name}/deps.js`),
      );
      assert(
        Deno.readFileSync(`${defaults.name}/dev_deps.js`),
      );
    },
  });

  await test({
    name:
      "only create configuration file(s) and no module entrypoints if settings.configOnly is true",
    fn: async () => {
      defaults.configOnly = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, 1);

      const configFile = Deno.readFileSync(
        `${defaults.name}/deno.json`,
      );

      assert(configFile);

      assertThrows(() => {
        Deno.readFileSync(`${defaults.name}/mod.ts`);
      });
      assertThrows(() => {
        Deno.readFileSync(`${defaults.name}/deps.ts`);
      });
      assertThrows(() => {
        Deno.readFileSync(`${defaults.name}/dev_deps.ts`);
      });
    },
  });

  await test({
    name: "create workflow file if settings.ci is true",
    fn: async () => {
      defaults.ci = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const workflowFile = Deno.readFileSync(
        `${defaults.name}/.github/workflows/build.yaml`,
      );

      assert(workflowFile);
    },
  });
});
