// Define default values here
import * as dat from 'dat.gui';

export const gui = new dat.GUI();
export const windowSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const enemyParams = {
    removeDistance: 5,
  }
// Add gui
gui.add(enemyParams, 'removeDistance', -1, 10).name('Enemy remove distance');

export default {
  name: 'test',
  
}