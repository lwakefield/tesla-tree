midi = require('easymidi')

class Synth {
  constructor (faust) {
    this.input = new midi.Input('hello', true)
    this.output = new midi.Output('hello', true)
    this.backend = new faust.DspFaustNode(44100,512)
    this.backend.start()
  }
  noteon (note, velocity=127) {
    this.output.send('noteon', { note, velocity });
  }
  noteoff (note) {
    this.output.send('noteoff', { note });
  }
  destroy () {
    this.input.close()
    this.output.close()
    this.backend.stop()
    this.backend.destroy()
  }
}

module.exports = Synth
