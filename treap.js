class RandInt {
  next() {
    const value = Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER);
    return { value, done: false };
  }
}

class TreapNode {
  constructor(data, priority) {
    this.data = data;
    this.priority = priority;
    this.rank = 1;
    this.left = null;
    this.right = null;
  }
}

class Treap {
  constructor(prng = new RandInt()) {
    this._root = null;
    this._prng = prng;
  }

  add(data) {
    const node = new TreapNode(data, this._prng.next().value);
    const parent = this._findParentLeaf(data);

    if (parent === null) {
      this._root = node;
    } else if (data < parent.data) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    this._updateRank(node);

    this._heapOrder(node);
  }

  contains(data) {
    return this._findNode(data) !== null;
  }

  nth(n) {
    const _kth = (k, node) => {
      if (node === null) {
        return null;
      }

      if (node.rank === k) {
        return node.data;
      }

      if (k < node.rank) {
        return _kth(k, node.left);
      }

      return _kth(k - node.rank, node.right);
    };

    return _kth(n + 1, this._root);
  }

  /* test function that should always return true */
  isHeapOrdered() {
    const _isHeapOrdered = (node) => {
      if (node === null) {
        return true;
      }
      return (
        node.priority <= (node.left?.priority ?? Number.MAX_SAFE_INTEGER) &&
        node.priority <= (node.right?.priority ?? Number.MAX_SAFE_INTEGER) &&
        _isHeapOrdered(node.left) &&
        _isHeapOrdered(node.right)
      );
    };

    return _isHeapOrdered(this._root);
  }

  _findFamily(node) {
    const __findFamily = (node2, parent, grandparent) => {
      if (node2 === null) {
        return null;
      }
      if (node2 === node) {
        return { parent, grandparent };
      }
      if (node.data === node2.data) {
        /* because of rotations, we don't know which side node is on */
        return (
          __findFamily(node2.left, node2, parent) ??
          __findFamily(node2.right, node2, parent)
        );
      }
      if (node.data < node2.data) {
        return __findFamily(node2.left, node2, parent);
      }
      return __findFamily(node2.right, node2, parent);
    };

    return __findFamily(this._root, null, null);
  }

  _findNode(data) {
    const __findNode = (node) => {
      if (node === null || node.data === data) {
        return node;
      }
      if (data < node.data) {
        return __findNode(node.left);
      }
      return __findNode(node.right);
    };

    return __findNode(this._root);
  }

  _findParentLeaf(data) {
    const __findParentLeaf = (node, parent) => {
      if (node === null) {
        return parent;
      }
      if (data < node.data) {
        return __findParentLeaf(node.left, node);
      }
      return __findParentLeaf(node.right, node);
    };

    return __findParentLeaf(this._root, null);
  }

  _updateRank(node) {
    const __updateRank = (node, cameFromLeft) => {
      if (node === null) {
        return;
      }

      if (cameFromLeft) {
        ++node.rank;
      }

      const { parent } = this._findFamily(node);
      __updateRank(parent, node === parent?.left);
    };

    __updateRank(node, false);
  }

  _heapOrder(node) {
    const { parent, grandparent } = this._findFamily(node);

    if (parent === null) {
      return;
    }

    if (node.priority >= parent.priority) {
      return;
    }

    if (grandparent === null) {
      this._root = node;
    } else {
      if (parent === grandparent.left) {
        grandparent.left = node;
      } else {
        grandparent.right = node;
      }
    }

    if (node === parent.left) {
      /* right rotation */
      parent.left = node.right;
      node.right = parent;
      parent.rank -= node.rank;
    } else {
      /* left rotation */
      parent.right = node.left;
      node.left = parent;
      node.rank += parent.rank;
    }

    this._heapOrder(node);
  }
}

exports.Treap = Treap;
