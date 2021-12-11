const jsc = require("jsverify");

const { Treap } = require("../treap");

describe("Treap", () => {
  jsc.property(
    "contains(x) returns true for numbers added to the treap",
    "array (nat & nat)",
    (nums) => {
      const values = nums.map((tuple) => tuple[0]);
      const priorities = nums.map((tuple) => tuple[1]);

      const prng = priorities[Symbol.iterator]();
      const treap = new Treap(prng);

      for (let i = 0; i < values.length; ++i) {
        treap.add(values[i]);
        for (let j = 0; j <= i; ++j) {
          if (!treap.contains(values[j])) {
            return false;
          }
        }
      }

      return true;
    }
  );

  jsc.property(
    "contains(x) returns false for numbers not added to the treap",
    "array (nat & nat)",
    (nums) => {
      const values = nums.map((tuple) => tuple[0]);
      const priorities = nums.map((tuple) => tuple[1]);

      const prng = priorities[Symbol.iterator]();
      const treap = new Treap(prng);

      for (let i = 0; i < values.length; ++i) {
        const subArray = values.slice(0, i);
        for (const value of values.filter((v) => !subArray.includes(v))) {
          if (treap.contains(value)) {
            return false;
          }
        }
        treap.add(values[i]);
      }

      return true;
    }
  );

  jsc.property(
    "add(x) preserves heap ordering",
    "array (nat & nat)",
    (nums) => {
      const values = nums.map((tuple) => tuple[0]);
      const priorities = nums.map((tuple) => tuple[1]);

      const prng = priorities[Symbol.iterator]();
      const treap = new Treap(prng);

      for (const value of values) {
        if (!treap.isHeapOrdered()) {
          return false;
        }
        treap.add(value);
      }

      return treap.isHeapOrdered();
    }
  );

  jsc.property(
    "nth(n) returns the nth element in the treap in ascending sorted order",
    "array (nat & nat)",
    (nums) => {
      const values = nums.map((tuple) => tuple[0]);
      const priorities = nums.map((tuple) => tuple[1]);

      const prng = priorities[Symbol.iterator]();
      const treap = new Treap(prng);

      for (let i = 0; i < values.length; ++i) {
        treap.add(values[i]);
        const sorted = values.slice(0, i + 1).sort((a, b) => a - b);
        for (let j = 0; j < sorted.length; ++j) {
          if (treap.nth(j) !== sorted[j]) {
            return false;
          }
        }
      }

      return true;
    }
  );
});
