import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Scene } from 'three';
import MainScene from './common/Main';
import { windowSizes } from './common/globals';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  windowSizes.width / windowSizes.height,
  0.1,
  100,
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(windowSizes.width, windowSizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



window.addEventListener('resize', () => {
  // Update windowSizes
  windowSizes.width = window.innerWidth;
  windowSizes.height = window.innerHeight;

  // Update camera
  camera.aspect = windowSizes.width / windowSizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(windowSizes.width, windowSizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Init Function
 */

const init = () => {
  const SceneMain = new MainScene({ scene });
  const update = () => {
    controls.update();
    SceneMain.update();
    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(update);
  };
  update();
}
init();