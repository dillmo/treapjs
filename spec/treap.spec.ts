import fc from "fast-check";

import { Treap, TreapNode } from "../treap";

const which = <T>(xs: T[], predicate: (x: T, idx: number) => boolean) =>
  xs.reduce<number[]>(
    (acc, x, idx) => (predicate(x, idx) ? [...acc, idx] : acc),
    []
  );

const uniqueIds = <T>(xs: T[]) => which(xs, (x, idx) => xs.indexOf(x) === idx);

const difference = <T>(xs: T[], ys: T[]) => xs.filter((x) => !ys.includes(x));

const fst = <T, U>([x, _]: [T, U]) => x;
const snd = <T, U>([_, x]: [T, U]) => x;

const unzip = <T, U>(x: [T, U][]): [T[], U[]] => [x.map(fst), x.map(snd)];

const idIn =
  <T>(ids: T[]) =>
  <U>(_: U, id: T) =>
    ids.includes(id);

const sameSizeArrayPairArb = <T, U>(
  arb1: fc.Arbitrary<T>,
  arb2: fc.Arbitrary<U>
) => fc.array(fc.tuple(arb1, arb2)).map(unzip);
const uniqSndSameSizeArrayPairArb = <T, U>(
  arb1: fc.Arbitrary<T>,
  arb2: fc.Arbitrary<U>
) =>
  fc.array(fc.tuple(arb1, arb2)).map((xs): [T[], U[]] => {
    const [ys, zs] = unzip(xs);
    const ids = uniqueIds(zs);
    return [ys.filter(idIn(ids)), zs.filter(idIn(ids))];
  });

describe("Treap constructor", () => {
  it("has no node whose left child is not less than it", () => {
    fc.assert(
      fc.property(
        sameSizeArrayPairArb(fc.nat(), fc.nat()),
        ([randoms, elems]) => {
          const _prop = <T>(node: TreapNode<T> | null): boolean => {
            if (node === null) {
              return true;
            }
            const satisfiesProp =
              node.left === null ? true : node.left.key < node.key;
            return satisfiesProp && _prop(node.left) && _prop(node.right);
          };
          const treap = new Treap(randoms, elems);
          return _prop(treap.root);
        }
      )
    );
  });

  it("has no node whose right child is not greater than it", () => {
    fc.assert(
      fc.property(
        sameSizeArrayPairArb(fc.nat(), fc.nat()),
        ([randoms, elems]) => {
          const _prop = <T>(node: TreapNode<T> | null): boolean => {
            if (node === null) {
              return true;
            }
            const satisfiesProp =
              node.right === null ? true : node.right.key > node.key;
            return satisfiesProp && _prop(node.left) && _prop(node.right);
          };
          const treap = new Treap(randoms, elems);
          return _prop(treap.root);
        }
      )
    );
  });

  it("contains every element that was added to it", () => {
    fc.assert(
      fc.property(
        sameSizeArrayPairArb(fc.nat(), fc.nat()),
        ([randoms, elems]) => {
          const treap = new Treap(randoms, elems);
          return elems.reduce<boolean>(
            (acc, elem) => acc && treap.contains(elem),
            true
          );
        }
      )
    );
  });

  it("does not contain any elements that weren't added to it", () => {
    fc.assert(
      fc.property(
        sameSizeArrayPairArb(fc.nat(), fc.nat()),
        fc.array(fc.nat()),
        ([randoms, contains], notContains) => {
          const treap = new Treap(randoms, contains);
          return difference(notContains, contains).reduce<boolean>(
            (acc, elem) => acc && !treap.contains(elem),
            true
          );
        }
      )
    );
  });

  it("has no node whose left child has a lesser priority", () => {
    fc.assert(
      fc.property(
        sameSizeArrayPairArb(fc.nat(), fc.nat()),
        ([randoms, elems]) => {
          const _prop = <T>(node: TreapNode<T> | null): boolean => {
            if (node === null) {
              return true;
            }
            const satisfiesProp =
              node.left === null ? true : node.priority <= node.left.priority;
            return satisfiesProp && _prop(node.left) && _prop(node.right);
          };
          const treap = new Treap(randoms, elems);
          return _prop(treap.root);
        }
      )
    );
  });

  it("has no node whose right child has a lesser priority", () => {
    fc.assert(
      fc.property(
        sameSizeArrayPairArb(fc.nat(), fc.nat()),
        ([randoms, elems]) => {
          const _prop = <T>(node: TreapNode<T> | null): boolean => {
            if (node === null) {
              return true;
            }
            const satisfiesProp =
              node.right === null ? true : node.priority <= node.right.priority;
            return satisfiesProp && _prop(node.left) && _prop(node.right);
          };
          const treap = new Treap(randoms, elems);
          return _prop(treap.root);
        }
      )
    );
  });

  it("associates every element in its source set with the correct priority", () => {
    fc.assert(
      fc.property(
        uniqSndSameSizeArrayPairArb(fc.nat(), fc.nat()),
        ([randoms, elems]) => {
          const treap = new Treap(randoms, elems);
          return elems.reduce<boolean>(
            (acc, elem, idx) => acc && treap.priority(elem) === randoms[idx],
            true
          );
        }
      )
    );
  });
});

// describe add

// describe remove

// describe nth
