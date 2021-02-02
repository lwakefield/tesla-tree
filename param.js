const clamp = (val, min, max) => {
  if (val <= min) return min;
  if (val >= max) return max;
  return val;
}

function num (name, defult, min, max, step) {
  const i = { name, value: defult };
  i.inc = () => i.value = clamp(i.value + step, min, max);
  i.dec = () => i.value = clamp(i.value - step, min, max);
  return i;
}

function choices (name, defult, choices) {
  const i = { name, value: defult };
  i.inc = () => {
    i.value = choices[choices.indexOf(i.value) + 1];
    if (!i.value) i.value = choices[choices.length - 1];
  };
  i.dec = () => {
    i.value = choices[choices.indexOf(i.value) - 1];
    if (!i.value) i.value = choices[0];
  };
  return i;
}

module.exports = { num, choices };
