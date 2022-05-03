import { calcTileType } from '../utils';

test('Отрисовка поля', () => {
  const recieved = [];
  for (let i = 0; i < 64; i += 1) {
    recieved.push(calcTileType(i, 8));
  }
  const expected = [
    'top-left', 'top', 'top', 'top', 'top', 'top', 'top', 'top-right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'bottom-left', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom-right',
  ];

  expect(recieved).toEqual(expected);
});
