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
  process.stdout.write(H.mvto(1, 1) + H.revif(`tonic: ${World.patch.tonic.value}`, selected==='tonic'));
  process.stdout.write(H.mvto(2, 1) + H.revif(`scale: ${World.patch.scalename.value}`, selected==='scale'));
  process.stdout.write(H.mvto(3, 1) + H.revif(`seed:  ${World.patch.seed.value.toString(36)}`, selected==='seed'));

  process.stdout.write(H.mvto(1, 16) + H.revif(`range:  ${World.patch.range.value}`, selected==='range'));
  process.stdout.write(H.mvto(2, 16) + H.revif(`length: ${World.patch.length.value}`, selected==='length'));

  process.stdout.write(H.mvto(1, 32) + H.revif(`branches:  ${World.patch.mutation_branches.value}`, selected==='branches'));
  process.stdout.write(H.mvto(2, 32) + H.revif(`mutations: ${World.patch.mutation_amt.value}`, selected==='mutations'));
  process.stdout.write(H.mvto(3, 32) + H.revif(`loops:     ${World.patch.max_loop_count.value}`, selected==='loops'));
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

  if (selected === 'tonic' && key === 'l') World.patch.tonic.inc();
  if (selected === 'tonic' && key === 'h') World.patch.tonic.dec();

  if (selected === 'scale' && key === 'l') World.patch.scalename.inc();
  if (selected === 'scale' && key === 'h') World.patch.scalename.dec();

  if (selected === 'seed' && key === 'l') World.patch.seed.inc();
  if (selected === 'seed' && key === 'h') World.patch.seed.dec();

  if (selected === 'range' && key === 'l') World.patch.range.inc();
  if (selected === 'range' && key === 'h') World.patch.range.dec();

  if (selected === 'length' && key === 'l') World.patch.length.inc();
  if (selected === 'length' && key === 'h') World.patch.length.dec();

  if (selected === 'branches' && key === 'l') World.patch.mutation_branches.inc();
  if (selected === 'branches' && key === 'h') World.patch.mutation_branches.dec();

  if (selected === 'mutations' && key === 'l') World.patch.mutation_amt.inc();
  if (selected === 'mutations' && key === 'h') World.patch.mutation_amt.dec();

  if (selected === 'loops' && key === 'l') World.patch.max_loop_count.inc();
  if (selected === 'loops' && key === 'h') World.patch.max_loop_count.dec();

  // TODO: we don't always want to update, because it does some
  // resetting
  World.update();

  redraw();
});

World.aftertick = redraw;

process.on('exit', () => {
  World.destroy();
});
