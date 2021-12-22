export interface TreapNode<T> {
  readonly left: TreapNode<T> | null;
  readonly right: TreapNode<T> | null;
  readonly key: T;
  readonly priority: number;
}

const fst = <T, U>([x, _]: [T, U]) => x;
const snd = <T, U>([_, x]: [T, U]) => x;

const zip = <T, U>(xs: T[], ys: U[]): [T, U][] =>
  xs.map((x, idx) => [x, ys[idx]]);
const unzip = <T, U>(x: [T, U][]): [T[], U[]] => [x.map(fst), x.map(snd)];

const add = <T>(
  node: TreapNode<T> | null,
  priority: number,
  key: T
): TreapNode<T> | null => {
  if (node === null) {
    return { left: null, right: null, key, priority };
  }
  if (key < node.key) {
    return { ...node, left: add(node.left, priority, key) };
  }
  if (key > node.key) {
    return { ...node, right: add(node.right, priority, key) };
  }
  return node;
};

const construct = <T>(randoms: number[], xs: T[]) => {
  return xs.reduce<TreapNode<T> | null>(
    (acc, x, idx) => add(acc, randoms[idx], x),
    null
  );
};

export class Treap<T> {
  readonly root: TreapNode<T> | null;
  readonly rng: Iterable<number>;

  constructor(rng: Iterable<number>, xs: T[]) {
    const sorted = zip(Array.from(rng), xs).sort(([x, _a], [y, _b]) =>
      x < y ? -1 : x === y ? 0 : 1
    );
    const [sortedRng, sortedXs] = unzip(sorted);
    this.root = construct(sortedRng, sortedXs);
    this.rng = rng;
  }

  private _find(node: TreapNode<T> | null, x: T): TreapNode<T> | null {
    if (node === null) {
      return null;
    }
    if (x < node.key) {
      return this._find(node.left, x);
    }
    if (x > node.key) {
      return this._find(node.right, x);
    }
    return node;
  }

  contains(x: T) {
    return this._find(this.root, x) !== null;
  }

  priority(x: T): number | null {
    return this._find(this.root, x)?.priority ?? null;
  }
}
