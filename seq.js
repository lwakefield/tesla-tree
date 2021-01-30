tonal = require('@tonaljs/tonal')

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

class Seq {
  constructor ({ tonic, scale, range, length }) {
    Object.assign(this, { tonic, range, length })
    if (scale instanceof Array) {
      this.scale = scale;
    } else if (typeof scale === 'string') {
      this.scale = mkscale(
        tonal.Scale.get(`${tonic.replace(/\d+/, '')} ${scale}`).notes
      );
    } else {
      throw new Error(`Unimplemented scale type: ${scale}`);
    }
    this.seed = null
    this.rand = null;
    this.notes = null
  }
  init (seed) {
    this.seed = seed;
    this.rand = xmur3(seed);
    const res = [this.tonic];
    while (res.length < this.length) {
      const last = res[res.length - 1];
      const dir = Math.round((this.rand() * this.range * 2) - this.range)
      // TODO: clamp
      const next_note_index = (this.scale.indexOf(last) + dir);
      res.push(this.scale[next_note_index]);
    }
    this.notes = res
  }
  clone () {
    const res = new Seq({
      tonic:  this.tonic,
      scale:  this.scale,
      range:  this.range,
      length: this.length,
    });
    res.seed  =  this.seed;
    res.rand  =  this.rand;
    res.notes =  [ ...this.notes ];
    return res;
  }
  mutate (num) {
    const mutation = this.clone();
    mutation.seed = null;
    for (let i = 0; i < num; i++) {
      const index = Math.floor(this.rand() * this.length);
      const dir = Math.round((this.rand() * this.range * 2) - this.range);
      // TODO: clamp
      const next_scale_index = this.scale.indexOf(this.notes[index]) + dir;
      mutation.notes[index] = this.scale[next_scale_index];
    }
    return mutation;
  }
}

module.exports = Seq;

// const scale = mkscale(tonal.Scale.get('c major').notes);
// const seq = mkseq('C4', scale, 2, 8, 'hello');
