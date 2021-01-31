tonal = require('@tonaljs/tonal')
Tree  = require('./tree.js');

function mkscale (scale) {
  let res = [];
  for (let i = 0; i <= 8; i++) {
    for (const note of scale) {
      res.push(note + i);
    }
  }
  return res;
}

function xmur3(str) {
  for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
      h = h << 13 | h >>> 19;
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 2 ** 32;
  }
}

function genseqs (patch) {
  const {
    tonic,
    scalename,
    range,
    length,
    seed,
    mutation_branches,
    mutation_amt
  } = patch;
  const rand = xmur3(seed);
  const scale = mkscale(
    tonal.Scale.get(`${tonic.replace(/\d+/, '')} ${scalename}`).notes
  );

  // base sequence
  const base_seq = [tonic];
  while (base_seq.length < length) {
    const last = base_seq[base_seq.length - 1];
    const dir = Math.round((rand() * range * 2) - range)
    // TODO: clamp
    const next_note_index = (scale.indexOf(last) + dir);
    base_seq.push(scale[next_note_index]);
  }

  const tree = Tree.mktree2(base_seq, mutation_branches, (seq) => {
    const new_seq = [...seq];
    for (let i = 0; i < mutation_amt; i++) {
      const index = Math.floor(rand() * length);
      const dir = Math.round((rand() * range * 2) - range);
      // TODO: clamp
      const next_scale_index = scale.indexOf(seq[index]) + dir;
      new_seq[index] = scale[next_scale_index];
    }
    return new_seq;
  });

  return tree;
}

module.exports.genseqs = genseqs;
