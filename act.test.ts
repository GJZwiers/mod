import { assert, assertEquals, assertThrowsAsync } from "./dev_deps.ts";
import { act, runCommand } from "./act.ts";
import { defaults } from "./settings.ts";
import { sinon } from "./dev_deps.ts";
import { assertThrows } from "https://deno.land/std@0.113.0/testing/asserts.ts";

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

// const defaults = self.structuredClone(defaults);

Deno.test("act()", async (test) => {
  defaults.name = "test_directory_act";

  const standardFiles = ["mod.ts", "deps.ts", "dev_deps.ts", ".gitignore"];

  const gitSpy = sinon.spy(defaults, "initGit");

  const fileSpy = sinon.spy(defaults, "addProjectFile");

  const beforeEach = async () => {
    await Deno.mkdir(defaults.name, { recursive: true });
  };

  const afterEach = async () => {
    await Deno.remove(defaults.name, { recursive: true });
    defaults.config = false;
    defaults.configOnly = false;
    defaults.git = false;
    defaults.importMap = false;

    gitSpy.resetHistory();
    fileSpy.resetHistory();
  };

  await test.step(
    "initialize git if settings.git is true",
    async () => {
      await beforeEach();

      defaults.git = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 1);
      assertEquals(fileSpy.getCalls().length, standardFiles.length);
      assert(`${defaults.name}/.git`);

      await afterEach();
    },
  );

  await test.step(
    "create import_map.json if settings.importMap is true",
    async () => {
      await beforeEach();

      defaults.importMap = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const mapFile = Deno.readFileSync(
        `${defaults.name}/import_map.json`,
      );

      assert(mapFile);

      await afterEach();
    },
  );

  await test.step(
    "create deno.json if settings.config is true",
    async () => {
      await beforeEach();

      defaults.config = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const configFile = Deno.readFileSync(
        `${defaults.name}/deno.json`,
      );

      assert(configFile);

      await afterEach();
    },
  );

  await test.step(
    "create .test file for module entrypoint if settings.testdriven is true",
    async () => {
      await beforeEach();

      defaults.tdd = true;

      await act(defaults);

      assertEquals(gitSpy.getCalls().length, 0);
      assertEquals(fileSpy.getCalls().length, standardFiles.length + 1);

      const testFile = Deno.readFileSync(
        `${defaults.name}/mod.test.ts`,
      );

      assert(testFile);

      await afterEach();
    },
  );

  await test.step(
    "only create configuration file(s) and no module entrypoints if settings.configOnly is true",
    async () => {
      await beforeEach();

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

      await afterEach();
    },
  );
});
