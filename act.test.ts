import { assert, assertEquals, assertThrows } from "./dev_deps.ts";
import { act, runCommand } from "./act.ts";
import { defaults } from "./settings.ts";
import { sinon } from "./dev_deps.ts";

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

  const fileSpy = sinon.spy(defaults, "addProjectFile");

  const gitSpy = sinon.spy(defaults, "initGit");

  const beforeEach = () => {
    Deno.mkdirSync(defaults.name, { recursive: true });
  };

  const afterEach = () => {
    Deno.removeSync(defaults.name, { recursive: true });

    defaults.config = false;
    defaults.configOnly = false;
    defaults.git = false;
    defaults.importMap = false;

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
});
