import { assertThrows } from "./dev_deps.ts";
import { validateOptions } from "./validate_options.ts";
import { settings } from "./settings.ts";

Deno.test("validateOptions()", async (context) => {
  const beforeEach = () => {
    settings.configOnly = true;
  };

  const afterEach = () => {
    settings.config = false;
    settings.configOnly = false;
    settings.git = false;
    settings.importMap = false;
    settings.tdd = false;
    settings.ci = false;
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
      settings.ci = true;

      assertThrows(() => {
        validateOptions(settings);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'config'",
    fn: () => {
      settings.config = true;

      assertThrows(() => {
        validateOptions(settings);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'import-map'",
    fn: () => {
      settings.importMap = true;

      assertThrows(() => {
        validateOptions(settings);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'js'",
    fn: () => {
      settings.js = true;

      assertThrows(() => {
        validateOptions(settings);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'prompt'",
    fn: () => {
      settings.prompt = true;

      assertThrows(() => {
        validateOptions(settings);
      });
    },
  });

  await test({
    name: "throw if 'config-only' is used with 'tdd'",
    fn: () => {
      settings.tdd = true;
      settings.configOnly = true;

      assertThrows(() => {
        validateOptions(settings);
      });
    },
  });
});
