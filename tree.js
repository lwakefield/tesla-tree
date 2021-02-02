// tree will always be balanced and binary
// seq should be an array of strings (notes)
function mktree (seq, num_nodes, mutate_fn) {
  const tree = [ seq ];
  const to_mutate = [ seq ];
  while (tree.length < num_nodes) {
    const next = to_mutate.shift();
    const left  = mutate_fn(next);
    tree.push(left);
    to_mutate.push(left);

    if (tree.length >= num_nodes) continue;

    const right = mutate_fn(next);
    tree.push(right);
    to_mutate.push(right);
  }
  return tree;
}

//        0
//    1       2
//  3   4   5   6
//  TODO: this needs lots of tests
function walker (tree) {
  let next = 0;
  let last = null;
  return () => {
    let curr = next;

    if (tree.length === 1) {
      // noop - every iteration will be the first node
    } else if ((1 + 2 * curr) >= tree.length) {
      // if no children prepend parent
      next = Math.floor((curr - 1) / 2);
    } else if (last === curr*2+2) {
      // if last was right child, then go to parent
      next = Math.floor((curr-1) / 2);
      if (next < 0) next = curr*2+1; // we are back at the root, start again
    } else if (last === curr*2+1) {
      next = curr*2+2;
      // if only one left child, then go up next
      if (next >= tree.length) next = Math.floor((curr-1) / 2)
      // if no parent, then go back to left
      if (next === -1) next = curr*2+1
    } else {
      next = curr*2+1;
    }

    last = curr;
    return curr;
  };
}

module.exports = { mktree, walker };
