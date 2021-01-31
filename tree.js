// tree will always be balanced and binary
// seq should be an array of strings (notes)
function mktree2 (seq, num_nodes, mutate_fn) {
  const tree = [ seq ];
  const to_mutate = [ seq ];
  for (let i = 1; i < num_nodes; i++) {
    const next = to_mutate.shift();
    const left  = mutate_fn(next);
    const right = mutate_fn(next);
    tree.push(left, right);
    to_mutate.push(left, right);
  }
  return tree;
}

//        0
//    1       2
//  3   4   5   6
function walker2 (tree) {
  let next = 0;
  let last = null;
  return () => {
    let curr = next;

    if ((1 + 2 * curr) >= tree.length) {
      // if no children prepend parent
      next = Math.floor((curr - 1) / 2);
    } else if (last === curr*2+2) {
      // if last was right child, then go to parent
      next = Math.floor((curr-1) / 2);
      if (next < 0) next = curr*2+1; // we are back at the root, start again
    } else if (last === curr*2+1) {
      next = curr*2+2;
    } else {
      next = curr*2+1;
    }

    last = curr;
    return curr;
  };
}

module.exports = { mktree2, walker2 };
