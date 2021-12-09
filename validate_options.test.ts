import { assertThrows } from "./dev_deps.ts";
import { validateOptions } from "./validate_options.ts";
import { defaults } from "./settings.ts";

Deno.test("validateOptions()", async (context) => {
  const beforeEach = () => {
    defaults.configOnly = true;
  };

  const afterEach = () => {
    defaults.config = false;
    defaults.configOnly = false;
    defaults.git = false;
    defaults.importMap = false;
    defaults.tdd = false;
    defaults.ci = false;
  };

  const test = async (
    options: Deno.TestDefinition,
  ) => {
    beforeEach();

    await context.step(options);

    afterEach();
  };

  await test({
    name: "throw if 'config-only' is used with 'ci'",
    fn: () => {
      defaults.ci = true;

      assertThrows(() => {
        validateOptions(defaults);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'config'",
    fn: () => {
      defaults.config = true;

      assertThrows(() => {
        validateOptions(defaults);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'import-map'",
    fn: () => {
      defaults.importMap = true;

      assertThrows(() => {
        validateOptions(defaults);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'js'",
    fn: () => {
      defaults.js = true;

      assertThrows(() => {
        validateOptions(defaults);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'prompt'",
    fn: () => {
      defaults.prompt = true;

      assertThrows(() => {
        validateOptions(defaults);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'tdd'",
    fn: () => {
      defaults.tdd = true;
      defaults.configOnly = true;

      assertThrows(() => {
        validateOptions(defaults);
      });
    },
  });
});
