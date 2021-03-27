export default class SafeArray {
    constructor() {
      this.array = [];
      this.addQueue = [];
      this.removeQueue = new Set();
    }

    get isEmpty() {
      return this.addQueue.length + this.array.length > 0;
    }

    add(element) {
      this.addQueue.push(element);
    }

    remove(element) {
      this.removeQueue.add(element);
    }

    forEach(fn) {
      this.addQueued();
        this.removeQueued();
        this.array.forEach(element => {
            if (!this.removeQueue.has(element)) {
                fn(element);
            }
        })
      this.removeQueued();
    }

    addQueued() {
      if (this.addQueue.length) {
        this.array.splice(this.array.length, 0, ...this.addQueue);
        this.addQueue = [];
      }
    }

    removeQueued() {
      if (this.removeQueue.size) {
        this.array = this.array.filter(element => !this.removeQueue.has(element));
        this.removeQueue.clear();
      }
    }
  }