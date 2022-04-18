export default class GameState {
  static from(object) {
    // TODO: create object
    if (typeof (object) === 'object') {
      return object;
    }
    alert('Ошибка, для сохранения нужен объект');
    return null;
  }
}

