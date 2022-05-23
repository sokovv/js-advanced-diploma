export default function attackRud(index, radius) {
  const Steps = new Set();
  let left = index;
  let right = index;
  let start = null;
  while (left > index - radius && left % 8 !== 0) {
    left -= 1;
  }
  while (right < index + radius && (right + 1) % 8 !== 0) {
    right += 1;
  }
  start = left;
  while (start <= right) {
    let topValues = start;
    let bottomValues = start;
    Steps.add(start);
    while (topValues > start - radius * 8 && topValues - 8 >= 0) {
      topValues -= 8;
      Steps.add(topValues);
    }
    while (bottomValues < start + radius * 8 && bottomValues + 8 < 64) {
      bottomValues += 8;
      Steps.add(bottomValues);
    }
    start += 1;
  }

  return [...Steps].sort((a, b) => a - b);
}
