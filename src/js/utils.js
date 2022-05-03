export function calcTileType(index, boardSize) {
  switch (index) {
    case 0:
      return 'top-left';
    case boardSize ** 2 - 1:
      return 'bottom-right';
    case boardSize * boardSize - boardSize:
      return 'bottom-left';
    case boardSize - 1:
      return 'top-right';
    default:
      break;
  }
  if ((index + 1) % boardSize === 0) {
    return 'right';
  }
  if (index % boardSize === 0) {
    return 'left';
  }

  if (index > 0 && index < boardSize - 1) {
    return 'top';
  }

  if (index > boardSize * boardSize - boardSize && index < boardSize ** 2 - 1) {
    return 'bottom';
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
