// Define default values here
import * as dat from 'dat.gui';

export const gui = new dat.GUI();
export const windowSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * ENEMIES
 */

export const enemyParams = {
    removeDistance: 5,
    speed: 20,
    interval: 1000,
  }
// Add gui
const enemyFolder = gui.addFolder('Enemy');
enemyFolder.add(enemyParams, 'removeDistance', -1, 10).name('Enemy remove distance');
enemyFolder.add(enemyParams, 'speed', 1, 40).name('Speed');
enemyFolder.add(enemyParams, 'interval', 500, 10000).name('Interval');

/**
 * CAMERA
 */

export const cameraParams = {
  initialX: 1,
  initialY: 0.5,
  initialZ: 2.5,
}

export default {
  name: 'test',
  deltaTime: 0,
  elapsedTime: 0,
  isGameStarted: false,
  gameOver: false,
  playTime: 0,
}