import { assert, assertEquals, assertThrows, sinon } from "./dev_deps.ts";
import { act, fns } from "./act.ts";
import { settings } from "./settings.ts";

Deno.test("runCommand()", async (test) => {
  settings.name = "test_directory";

  await test.step(
    "return true if git initialization succeeds",
    async () => {
      Deno.mkdirSync(settings.name, { recursive: true });
      assertEquals(await fns.initGit(settings.name), true);
      Deno.removeSync(settings.name, { recursive: true });
    },
  );
});

Deno.test("act()", async (context) => {
  settings.name = "test_directory_act";

  const fileSpy = sinon.spy(fns, "writeFileSec");

  const gitSpy = sinon.spy(fns, "initGit");

  const beforeEach = () => {
    Deno.mkdirSync(settings.name, { recursive: true });
  };

  const afterEach = () => {
    Deno.removeSync(settings.name, { recursive: true });

    settings.config = false;
    settings.configOnly = false;
    settings.git = false;
    settings.importMap = false;
    settings.tdd = false;
    settings.ci = false;
    settings.js = false;

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
      settings.git = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 1);
      assertEquals(fileSpy.getCalls().length, standardFiles.length);

      assert(`${settings.name}/.git`);
    },
  });

  await test({
    name: "create import_map.json if settings.importMap is true",
    fn: async () => {
      settings.importMap = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const mapFile = Deno.readFileSync(
        `${settings.name}/import_map.json`,
      );

      assert(mapFile);
    },
  });

  await test({
    name: "create deno.json if settings.config is true",
    fn: async () => {
      settings.config = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const configFile = Deno.readFileSync(
        `${settings.name}/deno.json`,
      );

      assert(configFile);
    },
  });

  await test({
    name: "create .test file for module entrypoint if settings.tdd is true",
    fn: async () => {
      settings.tdd = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const testFile = Deno.readFileSync(
        `${settings.name}/mod.test.ts`,
      );

      assert(testFile);
    },
  });

  await test({
    name: "create .js files when settings.js is true",
    fn: async () => {
      settings.js = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length);

      assert(
        Deno.readFileSync(`${settings.name}/mod.js`),
      );
      assert(
        Deno.readFileSync(`${settings.name}/deps.js`),
      );
      assert(
        Deno.readFileSync(`${settings.name}/dev_deps.js`),
      );
    },
  });

  await test({
    name:
      "only create configuration file(s) and no module entrypoints if settings.configOnly is true",
    fn: async () => {
      settings.configOnly = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, 1);

      const configFile = Deno.readFileSync(
        `${settings.name}/deno.json`,
      );

      assert(configFile);

      assertThrows(() => {
        Deno.readFileSync(`${settings.name}/mod.ts`);
      });
      assertThrows(() => {
        Deno.readFileSync(`${settings.name}/deps.ts`);
      });
      assertThrows(() => {
        Deno.readFileSync(`${settings.name}/dev_deps.ts`);
      });
    },
  });

  await test({
    name: "create workflow file if settings.ci is true",
    fn: async () => {
      settings.ci = true;

      await act(settings);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const workflowFile = Deno.readFileSync(
        `${settings.name}/.github/workflows/build.yaml`,
      );

      assert(workflowFile);
    },
  });
});
