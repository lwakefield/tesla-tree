class Node {
  constructor (value) {
    this.value = value;
    this.parent = null;
    this.children = [];
  }
  add_child(child) {
    this.children.push(child);
    child.parent = this;
    return child;
  }
}

//        a
//    b       c
//  d   e   f   g
// h i j k l m n o
function mktree (seq, num_mutations, mutate_amt) {
  const mutation_tree_root = new Node(seq);
  const to_mutate = [mutation_tree_root];
  for (let i = 1; i < num_mutations; i++) {
    const next = to_mutate.shift();
    const left = new Node(next.value.mutate(2));
    const right = new Node(next.value.mutate(2));
    next.add_child(left);
    next.add_child(right);
    to_mutate.push(left);
    to_mutate.push(right);
  }
  return mutation_tree_root;
}

//        a
//    b       c
//  d   e   f   g
// h i j k l m n o
//
// a b d b e b a c f c g c a
function walker (node) {
  const to_visit = [node];
  let last = null;
  return () => {
    const next = to_visit.shift();

    if (next.children.length === 0) {
      to_visit.unshift(next.parent);
    } else if (last && (idx = next.children.indexOf(last)) !== -1) {
      if (idx === next.children.length - 1) {
        if (next.parent) {
          to_visit.unshift(next.parent);
        } else {
          // we are back at the root and starting another traversal
          to_visit.unshift(...next.children);
        }
      }
    } else if (last && next.children.indexOf(last) === next.children.length - 1) {
      to_visit.push(next.parent);
    } else {
      to_visit.unshift(...next.children);
    }

    last = next;
    return next;
  }
}

// a = new Tree.Node('a');
// b = new Tree.Node('b');
// c = new Tree.Node('c');
// d = new Tree.Node('d');
// e = new Tree.Node('e');
// f = new Tree.Node('f');
// g = new Tree.Node('g');
// a.add_child(b); a.add_child(c);
// b.add_child(d); b.add_child(e);
// c.add_child(f); c.add_child(g);
// 
// const w = walker(a);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);
// console.log(w().value);

module.exports = { Node, mktree, walker };
