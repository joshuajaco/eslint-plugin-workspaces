"use strict";

const path = require("node:path");
const assert = require("node:assert");
const { ESLint: ESLint10 } = require("eslint");
const { ESLint: ESLint9 } = require("eslint9");
const { ESLint: ESLint8 } = require("eslint8");
const plugin = require("../../lib");
const snapshot = require("./snapshot");

const cwd = path.resolve("./tests/e2e/fixtures/app");
const files = ["packages/a/test.js"];

/**
 * Normalize lint messages for cross-version snapshot comparison.
 * ESLint v10 removes nodeType from LintMessage; v8/v9 include it.
 */
function normalizeMessages(messages) {
  return messages.map((msg) => {
    const normalized = { ...msg };
    delete normalized.nodeType;
    return normalized;
  });
}

describe("eslint 10", () => {
  function runLint(baseConfig) {
    return lintFiles(new ESLint10({ cwd, baseConfig }));
  }

  it("recommended", async () => {
    const messages = await runLint(plugin.configs.recommended);
    assert.deepStrictEqual(messages, normalizeMessages(snapshot.recommended));
  });

  it("all", async () => {
    const messages = await runLint(plugin.configs.all);
    assert.deepStrictEqual(messages, normalizeMessages(snapshot.all));
  });

  it("flat/recommended", async () => {
    assert.equal(
      plugin.configs["flat/recommended"],
      plugin.configs.recommended,
    );
  });

  it("flat/all", async () => {
    assert.equal(plugin.configs["flat/all"], plugin.configs.all);
  });
});

describe("eslint 9", () => {
  function runLint(baseConfig) {
    return lintFiles(new ESLint9({ cwd, baseConfig }));
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

  it("legacy-recommended", async () => {
    const messages = await runLint(plugin.configs["legacy-recommended"]);
    assert.deepStrictEqual(messages, snapshot.recommended);
  });

  it("legacy-all", async () => {
    const messages = await runLint(plugin.configs["legacy-all"]);
    assert.deepStrictEqual(messages, snapshot.all);
  });
});

async function lintFiles(linter) {
  const results = await linter.lintFiles(files);
  return results.flatMap((result) => result.messages);
}
