import fc from "fast-check";

import { Treap, TreapNode } from "../treap";

const unique = <T>(xs: T[]) => xs.filter((x, idx) => xs.indexOf(x) === idx);

const difference = <T>(xs: T[], ys: T[]) => xs.filter((x) => !ys.includes(x));

describe("Treap constructor", () => {
  it("has only nodes whose left children are less than them", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (elems) => {
        const _prop = <T>(node: TreapNode<T> | null): boolean => {
          if (node === null || node.left === null) {
            return true;
          }
          return node.left.key < node.key && _prop(node.left);
        };
        const treap = new Treap(elems);
        return _prop(treap.root);
      })
    );
  });

  it("has no node whose right child is less than it", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (elems) => {
        const _prop = <T>(node: TreapNode<T> | null): boolean => {
          if (node === null || node.right === null) {
            return true;
          }
          return node.right.key >= node.key && _prop(node.right);
        };
        const treap = new Treap(elems);
        return _prop(treap.root);
      })
    );
  });

  it("has the same size as the array of its unique elements", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (elems) => {
        const _size = <T>(node: TreapNode<T> | null): number => {
          if (node === null) {
            return 0;
          }
          return 1 + _size(node.left) + _size(node.right);
        };
        const treap = new Treap(elems);
        return _size(treap.root) === unique(elems).length;
      })
    );
  });

  it("contains every element that was added to it", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (elems) => {
        const treap = new Treap(elems);
        return elems.reduce<boolean>(
          (acc, elem) => acc && treap.contains(elem),
          true
        );
      })
    );
  });

  it("does not contain any elements that weren't added to it", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (add, dontAdd) => {
        const treap = new Treap(add);
        return difference(dontAdd, add).reduce<boolean>(
          (acc, elem) => acc && !treap.contains(elem),
          true
        );
      })
    );
  });

  // it has min-heap order by priorities
  // - all prios can be 1

  // it associates every element with the correct priority
});
