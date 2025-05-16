"use strict";

const path = require("node:path");
const assert = require("node:assert");
const { ESLint } = require("eslint");
const { ESLint: ESLint8 } = require("eslint8");
const plugin = require("../../lib");
const snapshot = require("./snapshot");

const cwd = path.resolve("./tests/e2e/fixtures/app");
const files = ["packages/a/test.js"];

describe("eslint 9", () => {
  function runLint(baseConfig) {
    return lintFiles(new ESLint({ cwd, baseConfig }));
  }

  it("flat/recommended", async () => {
    const messages = await runLint(plugin.configs["flat/recommended"]);
    assert.deepStrictEqual(messages, snapshot.recommended);
  });

  it("flat/all", async () => {
    const messages = await runLint(plugin.configs["flat/all"]);
    assert.deepStrictEqual(messages, snapshot.all);
  });
});

describe("eslint 8", () => {
  function runLint(baseConfig) {
    return lintFiles(
      new ESLint8({
        cwd,
        baseConfig,
        plugins: { workspaces: plugin },
      }),
    );
  }

  it("recommended", async () => {
    const messages = await runLint(plugin.configs.recommended);
    assert.deepStrictEqual(messages, snapshot.recommended);
  });

  it("all", async () => {
    const messages = await runLint(plugin.configs.all);
    assert.deepStrictEqual(messages, snapshot.all);
  });
});

async function lintFiles(linter) {
  const results = await linter.lintFiles(files);
  return results.flatMap((result) => result.messages);
}
