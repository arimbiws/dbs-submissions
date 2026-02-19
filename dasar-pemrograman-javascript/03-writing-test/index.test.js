import assert from "node:assert";
import { test } from "node:test";
import { sum } from "./index.js";

test("Testing", () => {
  const num1 = 17;
  const num2 = 8;

  const result = sum(num1, num2);

  const expected = 25;
  assert.equal(result, expected);
});
