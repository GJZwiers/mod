import { assertEquals, assertThrowsAsync } from "./dev_deps.ts";
import { hasNoFileExtension, writeFileSec } from "./utils.ts";

Deno.test("writeFileOrWarn()", async (t) => {
  const testFilePath = "./foo.ts";
  const testFileContent = new TextEncoder().encode("foo");

  const afterEach = async () => {
    try {
      await Deno.remove(testFilePath, { recursive: true });
    } catch (_error) {
      console.log("Could not remove file");
    }
  };

  await t.step(
    "should write a new file if the path does not exist yet",
    async () => {
      await writeFileSec(testFilePath, testFileContent);
      const file = await Deno.readFile(testFilePath);

      assertEquals(new TextDecoder().decode(file), "foo");

      await afterEach();
    },
  );

  await t.step("should overwrite when the force flag is set", async () => {
    await writeFileSec(testFilePath, testFileContent, { force: false });
    await writeFileSec(testFilePath, new TextEncoder().encode("bar"), {
      force: true,
    });

    const file = await Deno.readFile(testFilePath);

    assertEquals(new TextDecoder().decode(file), "bar");

    await afterEach();
  });

  await t.step("should warn when file already exists", async () => {
    await Deno.writeFile(testFilePath, testFileContent);

    await writeFileSec(testFilePath, testFileContent);

    await afterEach();
  });
});

Deno.test("mkdirOrWarn()", async (t) => {
  const testDirPath = "./dir";

  const afterEach = async () => {
    await Deno.remove(testDirPath);
  };

  await t.step(
    "should make a new directory if it does not exist yet",
    async () => {
      await Deno.mkdir(testDirPath);

      await assertThrowsAsync(() => {
        return Deno.mkdir(testDirPath);
      });

      await afterEach();
    },
  );
});

Deno.test("hasFileExtension()", async (t) => {
  await t.step("should validate a filename correctly", () => {
    assertEquals(hasNoFileExtension("mod.ts", "ts"), false);
    assertEquals(hasNoFileExtension("mod.ts", "js"), true);
    assertEquals(hasNoFileExtension("mod", "ts"), true);
  });
});
