import SafeArray from "./SafeArray";

export default class GameObjectManager {
    constructor() {
      this.gameObjects = new SafeArray();
    }

    createGameObject(Component, ...args) {
      const gameObject = new Component(...args);
      this.gameObjects.add(gameObject);
      return gameObject;
    }

    removeGameObject(gameObject) {
      this.gameObjects.remove(gameObject);
    }

    update() {
      this.gameObjects.forEach(gameObject => gameObject.update());
    }
  }