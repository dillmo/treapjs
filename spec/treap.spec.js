const fc = require("fast-check");

const { Treap } = require("../treap");

const dedupArr = (arr) => arr.filter((elem, idx) => arr.indexOf(elem) === idx);

describe("Treap", () => {
  const setup = (nums) => {
    const values = nums.map((tuple) => tuple[0]);
    const priorities = nums.map((tuple) => tuple[1]);

    const prng = priorities[Symbol.iterator]();
    const treap = new Treap(prng);

    return { treap, values };
  };

  it("contains(x) returns true for numbers added to the treap", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.nat(), fc.nat())), (nums) => {
        const { treap, values } = setup(nums);

        for (let i = 0; i < values.length; ++i) {
          treap.add(values[i]);
          for (let j = 0; j <= i; ++j) {
            if (!treap.contains(values[j])) {
              return false;
            }
          }
        }

        return true;
      })
    );
  });

  it("contains(x) returns false for numbers not added to the treap", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.nat(), fc.nat())), (nums) => {
        const { treap, values } = setup(nums);

        for (let i = 0; i < values.length; ++i) {
          const notAdded = values.filter(
            (v) => !values.slice(0, i).includes(v)
          );
          for (const value of notAdded) {
            if (treap.contains(value)) {
              return false;
            }
          }
          treap.add(values[i]);
        }

        return true;
      })
    );
  });

  it("add(x) preserves heap ordering", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.nat(), fc.nat())), (nums) => {
        const { treap, values } = setup(nums);

        for (const value of values) {
          if (!treap.isHeapOrdered()) {
            return false;
          }
          treap.add(value);
        }

        return treap.isHeapOrdered();
      })
    );
  });

  it("nth(n) returns the nth element in the treap in ascending sorted order", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.nat(), fc.nat())), (nums) => {
        const { treap, values } = setup(nums);

        for (let i = 0; i < values.length; ++i) {
          treap.add(values[i]);
          const sorted = dedupArr(values.slice(0, i + 1)).sort((a, b) => a - b);
          for (let j = 0; j < sorted.length; ++j) {
            if (treap.nth(j) !== sorted[j]) {
              return false;
            }
          }
        }

        return true;
      })
    );
  });
});
