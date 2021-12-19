const unique = <T>(xs: T[]) => xs.filter((x, idx) => xs.indexOf(x) === idx);

export interface TreapNode<T> {
  left: TreapNode<T> | null;
  right: TreapNode<T> | null;
  key: T;
}

const construct = <T>(xs: T[]): TreapNode<T> | null => {
  if (xs.length === 0) {
    return null;
  }
  return { left: null, right: construct(xs.slice(1)), key: xs[0] };
};

export class Treap<T> {
  root: TreapNode<T> | null;

  constructor(xs: T[]) {
    this.root = construct(unique(xs).sort((x, y) => (x < y ? -1 : 1)));
  }

  contains(x: T) {
    const _contains = (node: TreapNode<T> | null): boolean => {
      if (node === null) {
        return false;
      }
      if (node.key === x) {
        return true;
      }
      return _contains(node.right);
    };
    return _contains(this.root);
  }
}
