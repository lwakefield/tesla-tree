const perf    = require('perf_hooks')
const tonal   = require('@tonaljs/tonal')
const Synth   = require('./synth')
const Seq     = require('./seq')
const Tree    = require('./tree')
const Clock   = require('./clock')

class World {
  static init () {
    this.max_loop_count = 2;

    this.base_seq = new Seq({ tonic: 'C3', scale: 'minor', range: 5, length: 8});
    this.base_seq.init('hello')
    this.mutation_tree_root = Tree.mktree(this.base_seq, 15, 2);
    this.walk = Tree.walker(this.mutation_tree_root)
    this.synth = new Synth(require('./poly.node'))

    this._clock = new Clock(120, this.tick.bind(this));
    this._last_note = null;
    this._curr_seq = this.walk().value;
    this._curr_seq_pos = -1;
    this._loop_count = 1;
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
    if (this._curr_seq_pos >= this._curr_seq.length) {
      // we just finished a loop
      this._loop_count += 1;
      this._curr_seq_pos = 0;
    }
    if (this._loop_count > this.max_loop_count) {
      this._curr_seq = this.walk().value;
      this._loop_count = 1;
      // console.log(`starting next seq: ${curr_seq.notes}`);
    }

    const next_note = this._curr_seq.notes[this._curr_seq_pos];
    this.synth.noteon(tonal.Midi.toMidi(next_note), 32);
    this._last_note = next_note;
  }
}

World.init();
World.start();

process.on('exit', () => {
  world.destroy();
});
