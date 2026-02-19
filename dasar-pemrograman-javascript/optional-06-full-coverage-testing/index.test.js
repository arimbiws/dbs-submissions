import sum from "./index.js";
import assert from "node:assert";
import { test } from "node:test";

// Input bukan angka (Harus mengembalikan 0)
test("mengembalikan 0 jika salah satu atau kedua argumen bukan angka", () => {
  assert.strictEqual(sum("17", 8), 0); // a adalah string
  assert.strictEqual(sum(9, "12"), 0); // b adalah string
  assert.strictEqual(sum("3", "25"), 0); // keduanya string
});

// Input null atau undefined (Harus mengembalikan 0)
test("mengembalikan 0 jika salah satu atau kedua argumen null or undefined", () => {
  assert.strictEqual(sum(null, 10), 0);
  assert.strictEqual(sum(30, undefined), 0);
});

// Input angka negatif (Harus mengembalikan 0)
test("mengembalikan 0 jika terdapat angka negatif", () => {
  assert.strictEqual(sum(-9, 2), 0); // a negatif
  assert.strictEqual(sum(12, -8), 0); // b negatif
  assert.strictEqual(sum(-5, -5), 0); // keduanya negatif
});

// Input angka positif yang valid (Harus mengembalikan hasil penjumlahan)
test("mengembalikan hasil penjumlahan untuk dua angka positif", () => {
  assert.strictEqual(sum(17, 32), 49);
});

// Angka nol (Edge Case)
test("menjumlahkan angka nol dengan benar", () => {
  assert.strictEqual(sum(0, 5), 5);
  assert.strictEqual(sum(10, 0), 10);
  assert.strictEqual(sum(0, 0), 0);
});
