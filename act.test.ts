import { assert, assertEquals, assertThrows, sinon } from "./dev_deps.ts";
import { act, funcs, runCommand } from "./act.ts";
import { defaults } from "./settings.ts";

Deno.test("runCommand()", async (test) => {
  await test.step(
    "return true when a command's exit code is 0",
    async () => {
      const cmd = Deno.run({
        cmd: ["git", "init"],
        stdout: "null",
      });

      assertEquals(await runCommand(cmd), true);
    },
  );

  await test.step(
    "return false when a command's exit code is greater than 0",
    async () => {
      const cmd = Deno.run({
        cmd: ["git", "checkout", "foo"],
        stderr: "null",
      });

      assertEquals(await runCommand(cmd), false);
    },
  );
});

interface TestOptions {
  name: string;
  fn: (t: Deno.TestContext) => void | Promise<void>;
}

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
    options: TestOptions,
  ) => {
    beforeEach();

    await context.step(
      options.name,
      options.fn,
    );

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

  // await test({
  //   name:
  //     "throw error if config-only flag is used with another setting, except name",
  //   fn: async () => {
  //     const cmd = await runCommand(Deno.run({
  //       cmd: [
  //         "deno",
  //         "run",
  //         "-A",
  //         "--",
  //         "mod.ts",
  //         "--config-only",
  //         "--import-map",
  //       ],
  //     }));

  //     assertEquals(cmd, false);

  //     const cmd2 = await runCommand(Deno.run({
  //       cmd: [
  //         "deno",
  //         "run",
  //         "-A",
  //         "--",
  //         "mod.ts",
  //         "--config-only",
  //         "--name",
  //         defaults.name,
  //       ],
  //     }));

  //     assertEquals(cmd2, true);
  //   },
  // });

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
