// Define default values here
import * as dat from 'dat.gui';

export const gui = new dat.GUI();
export const windowSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const enemyParams = {
    removeDistance: 5,
    speed: 20,
  }
// Add gui
const enemyFolder = gui.addFolder('Enemy');
enemyFolder.add(enemyParams, 'removeDistance', -1, 10).name('Enemy remove distance');
enemyFolder.add(enemyParams, 'speed', 1, 20).name('Speed');

export default {
  name: 'test',
  deltaTime: 0,
}