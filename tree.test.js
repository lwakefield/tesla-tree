const assert = require('assert')
const { walker } = require('./tree.js')

//        0
//    1       2
//  3   4   5   6
let tree = [0, 1, 2, 3, 4, 5, 6];
let walk = walker(tree);
assert.equal(walk(), 0);
assert.equal(walk(), 1);
assert.equal(walk(), 3);
assert.equal(walk(), 1);
assert.equal(walk(), 4);
assert.equal(walk(), 1);
assert.equal(walk(), 0);
assert.equal(walk(), 2);
assert.equal(walk(), 5);
assert.equal(walk(), 2);
assert.equal(walk(), 6);
assert.equal(walk(), 2);
assert.equal(walk(), 0);
// at this point we start repeating
assert.equal(walk(), 1);
assert.equal(walk(), 3);

//  0
// 1 2
tree = [0, 1, 2];
walk = walker(tree);
assert.equal(walk(), 0);
assert.equal(walk(), 1);
assert.equal(walk(), 0);
assert.equal(walk(), 2);
assert.equal(walk(), 0);
// at this point we start repeating
assert.equal(walk(), 1);
assert.equal(walk(), 0);

//   0
//  1 2
// 3
tree = [0, 1, 2, 3];
walk = walker(tree);
assert.equal(walk(), 0);
assert.equal(walk(), 1);
assert.equal(walk(), 3);
assert.equal(walk(), 1);
assert.equal(walk(), 0);
assert.equal(walk(), 2);
assert.equal(walk(), 0);
// at this point we start repeating
assert.equal(walk(), 1);
assert.equal(walk(), 3);

//  0
// 1
tree = [0, 1];
walk = walker(tree);
assert.equal(walk(), 0);
assert.equal(walk(), 1);
assert.equal(walk(), 0);
assert.equal(walk(), 1);
