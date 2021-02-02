const perf    = require('perf_hooks')
const tonal   = require('@tonaljs/tonal')
const Synth   = require('./synth')
const Seq     = require('./seq')
const Tree    = require('./tree')
const Clock   = require('./clock')
const Param   = require('./param')

class World {
  static init () {
    this.patch = {
      tonic:             Param.choices('tonic', 'C4', Seq.mkscale(['A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#'])),
      scalename:         Param.choices('scale', 'minor', tonal.Scale.names()),
      range:             Param.num('range', 5, 0, 12, 1),
      length:            Param.num('length', 8, 1, 32, 1),
      seed:              Param.num('seed', parseInt('hello', 36), 0, 2**32, 1),
      mutation_branches: Param.num('branches', 15, 1, 128, 1),
      mutation_amt:      Param.num('mutations', 2, 1, 32, 1),
      max_loop_count:    Param.num('loops', 2, 1, 32, 1),
    };

    this.update();

    this.synth = new Synth(require('./poly.node'))

    this._clock = new Clock(480, this.tick.bind(this));
    this._last_note = null;
    this._curr_seq_pos = -1;
    this._loop_count = 1;
    this.aftertick = null;
  }
  static get curr_seq () {
    return this.seq_tree[this._curr_branch];
  }
  static update () {
    this.seq_tree = Seq.genseqs(this.patch);
    this.walk = Tree.walker(this.seq_tree);
    this._curr_branch = this.walk();
  }
  static start () {
    this._clock.start();
  }
  static destroy () {
    this.synth.destroy();
  }
  static tick () {
    if (this._last_note) {
      this.synth.noteoff(tonal.Midi.toMidi(this._last_note));
    }

    this._curr_seq_pos += 1;
    if (this._curr_seq_pos >= this.curr_seq.length) {
      // we just finished a loop
      this._loop_count += 1;
      this._curr_seq_pos = 0;
    }
    if (this._loop_count > this.patch.max_loop_count.value) {
      this._curr_branch = this.walk();
      this._loop_count = 1;
      // console.log(`starting next seq: ${this.curr_seq}`);
    }

    const next_note = this.curr_seq[this._curr_seq_pos];
    this.synth.noteon(tonal.Midi.toMidi(next_note), 32);
    this._last_note = next_note;

    this.aftertick && this.aftertick();
  }
}

module.exports = World;
