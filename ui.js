const readline = require('readline');

const tonal = require('@tonaljs/tonal');

const World = require('./world.js')
const H = require('./helpers.js')

World.init();
World.start();

let selected = 'tonic';
let menus = [
  'tonic',
  'scale',
  'seed',
  'range',
  'length',
  'branches',
  'mutations',
  'loops',
  'bpm'
]

function redraw () {
  process.stdout.write(H.clrscn);
  process.stdout.write(H.mvto(1, 1) + H.revif(`tonic: ${World.patch.tonic}`, selected==='tonic'));
  process.stdout.write(H.mvto(2, 1) + H.revif(`scale: ${World.patch.scalename}`, selected==='scale'));
  process.stdout.write(H.mvto(3, 1) + H.revif(`seed:  ${World.patch.seed.toString(36)}`, selected==='seed'));

  process.stdout.write(H.mvto(1, 16) + H.revif(`range:  ${World.patch.range}`, selected==='range'));
  process.stdout.write(H.mvto(2, 16) + H.revif(`length: ${World.patch.length}`, selected==='length'));

  process.stdout.write(H.mvto(1, 32) + H.revif(`branches:  ${World.patch.mutation_branches}`, selected==='branches'));
  process.stdout.write(H.mvto(2, 32) + H.revif(`mutations: ${World.patch.mutation_amt}`, selected==='mutations'));
  process.stdout.write(H.mvto(3, 32) + H.revif(`loops:     ${World.patch.max_loop_count}`, selected==='loops'));
  process.stdout.write(H.mvto(4, 32) + H.revif(`bpm:       ${World._clock.bpm}`, selected==='bpm'));

  const currseq = World.curr_seq.map(( v, k ) => {
    return k === World._curr_seq_pos ? H.rev(v.padEnd(3)) : v.padEnd(3)
  }).join(' ');
  process.stdout.write(H.mvto(6, 1) + currseq);
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (_, key) => {
  key = key.sequence;

  if (key === '\u0003') process.exit(0);

  if (key === 'j') {
    selected = menus[menus.indexOf(selected) + 1]
    if (!selected) selected = menus[menus.length-1];
  }

  if (key === 'k') {
    selected = menus[menus.indexOf(selected) - 1]
    if (!selected) selected = menus[0];
  }

  if (key === 'h' || key === 'l') {
    if (selected === 'tonic') {
      World.patch.tonic = tonal.Note.transpose(
        World.patch.tonic,
        key === 'l' ? '2m' : '-2m'
      );
      World.patch.tonic = tonal.Note.simplify(World.patch.tonic);
      World.update();
    }
  }

  redraw();
});

World.aftertick = redraw;

process.on('exit', () => {
  World.destroy();
});
