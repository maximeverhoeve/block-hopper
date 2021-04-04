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
// const camera =  new THREE.PerspectiveCamera( 50, windowSizes.width / windowSizes.height, 1, 100 );
camera.position.y = 0.5;
camera.position.z = 2.5;
scene.add(camera);

const fog = new THREE.Fog('#F9F3DE', 0, 60)
scene.fog = fog;

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  // antialias: true
});
renderer.setSize(windowSizes.width, windowSizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


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
  const SceneMain = new MainScene({ scene, camera });
  const update = () => {
    // controls.update();
    SceneMain.update();
    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(update);
  };
  update();
}
init();