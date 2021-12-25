import "./style.css";
import * as THREE from "three";
import Boid from "./boid.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loading
const textureLoader = new THREE.TextureLoader();
//// Background
const bgTexture = textureLoader.load("./Textures/Background/HDR.jpg");
bgTexture.mapping = THREE.EquirectangularReflectionMapping;
//bgTexture.encoding = THREE.sRGBEncoding;

scene.background = bgTexture;

// Boids
const BOID_NUMBER = 100;
const flock = [];

for (let i = 0; i < BOID_NUMBER; i++) flock.push(new Boid());

flock.forEach((boid) => scene.add(boid.getBoidObject()));

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 2.5;
camera.position.z = -10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Orbital Controls
  controls.update();

  flock.forEach((boid) => boid.update(flock));

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
