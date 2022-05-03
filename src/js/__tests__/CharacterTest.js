import Character from '../Character';
import Daemon from '../Daemon';

test('Создание Daemon', () => {
  const expected = {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    rudMove: 1,
    rudAttack: 3,
    type: 'daemon',
  };
  const received = new Daemon(1, Daemon);
  expect(received).toEqual(expected);
});

test('Ошибка при создании без типа', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new Character();
  }).toThrow();
});
