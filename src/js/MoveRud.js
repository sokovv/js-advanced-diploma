/* eslint-disable linebreak-style */
export default function moveRud(index, radius) {
  const Steps = new Set();
  let left = index;
  let right = index;
  let leftTop = index;
  let RightBot = index;
  let RightTop = index;
  let LeftBot = index;

  while (left > index - radius && left % 8 !== 0) {
    left -= 1;
    leftTop -= 9;
    LeftBot += 7;
  }
  while (right < index + radius && (right + 1) % 8 !== 0) {
    right += 1;
    RightTop -= 7;
    RightBot += 9;
  }

  function* makeRangeIterator(start = 0, end = 100, step = 1) {
    let iterationCount = 0;
    for (let i = start; i <= end; i += step) {
      iterationCount += 1;
      yield i;
    }
    return iterationCount;
  }
  const diagLeft = makeRangeIterator(leftTop, RightBot, 9);
  const med = makeRangeIterator(left, right);
  const vert = makeRangeIterator(index - 8 * radius, index + 8 * radius, 8);
  const diagRight = makeRangeIterator(RightTop, LeftBot, 7);

  for (const i of med) {
    Steps.add(i);
  }
  for (const i of vert) {
    Steps.add(i);
  }

  for (const i of diagLeft) {
    Steps.add(i);
  }
  for (const i of diagRight) {
    Steps.add(i);
  }

  return [...Steps].sort((a, b) => a - b);
}
