/**
 * src/main.js — entry point for Midnight Rocket Racer (web)
 * Initialises Three.js, post-processing, input, chase camera and game loop.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }     from 'three/addons/postprocessing/OutputPass.js';

import { createArena }                              from './arena.js';
import { createCar, resetCar, updateCar,
         applyBoostPad, getSpeedKph }               from './car.js';
import { createRace, resetRace, updateRace,
         isRaceActive }                             from './race.js';
import { createHUD, updateHUD }                     from './hud.js';

// ─── Renderer ────────────────────────────────────────────────────────────────

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace    = THREE.SRGBColorSpace;
document.getElementById('app').appendChild(renderer.domElement);

// ─── Scene & Camera ──────────────────────────────────────────────────────────

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight, 0.1, 3000);

// ─── Post-processing ─────────────────────────────────────────────────────────

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.15,  // strength
  0.60,  // radius
  0.55   // threshold
));
composer.addPass(new OutputPass());

// ─── Resize ──────────────────────────────────────────────────────────────────

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  composer.setSize(w, h);
}

onResize();
window.addEventListener('resize', onResize);

// ─── Game objects ────────────────────────────────────────────────────────────

const arena = createArena(scene);
const car   = createCar(scene);
resetCar(car, arena.spawn);
const race = createRace(arena.gates);

// createHUD also calls scene.add(camera) (required for camera children to render).
const hud = createHUD(scene, camera);

// ─── Chase camera state ───────────────────────────────────────────────────────

const camPos    = new THREE.Vector3();
const camLookAt = new THREE.Vector3();
let   camFov    = 78;

// Pre-seed so the first frame has no snap.
{
  const fwd = new THREE.Vector3(Math.sin(car.heading), 0, Math.cos(car.heading));
  camPos.copy(car.position).addScaledVector(fwd, -11).add(new THREE.Vector3(0, 4.4, 0));
  camera.position.copy(camPos);
}

// ─── Input ───────────────────────────────────────────────────────────────────

const keys = new Set();
window.addEventListener('keydown', (e) => keys.add(e.code));
window.addEventListener('keyup',   (e) => keys.delete(e.code));

// Edge-latch prevents R held-down from re-firing every frame.
let resetLatch = false;

// ─── Game loop ───────────────────────────────────────────────────────────────

const clock = new THREE.Clock();

function frame() {
  requestAnimationFrame(frame);

  const rawDt = clock.getDelta();
  const dt    = Math.min(rawDt, 1 / 30); // clamp to prevent huge physics steps

  // ── Gamepad ───────────────────────────────────────────────────────────────
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp       = gamepads[0] ?? null;

  // ── Build input ───────────────────────────────────────────────────────────
  let throttle     = 0;
  let steer        = 0;
  let boost        = false;
  let drift        = false;
  let jump         = false;
  let reverse      = false;
  let resetPressed = false;

  // Keyboard
  if (keys.has('KeyW')        || keys.has('ArrowUp'))    { throttle = 1; }
  if (keys.has('KeyS')        || keys.has('ArrowDown'))  { throttle = -1; reverse = true; }
  if (keys.has('KeyA')        || keys.has('ArrowLeft'))  steer -= 1;
  if (keys.has('KeyD')        || keys.has('ArrowRight')) steer += 1;
  if (keys.has('ShiftLeft'))                             boost  = true;
  if (keys.has('Space'))                                 drift  = true;
  if (keys.has('ControlLeft'))                           jump   = true;
  if (keys.has('KeyR'))                                  resetPressed = true;

  // Gamepad — additive with keyboard so both can be held simultaneously.
  if (gp) {
    let gpSteer = gp.axes[0] ?? 0;
    if (Math.abs(gpSteer) < 0.12) gpSteer = 0; // deadzone
    steer += gpSteer;

    // RT (button 7) = forward throttle; LT (button 6) = reverse throttle.
    const rt = gp.buttons[7]?.value ?? 0;
    const lt = gp.buttons[6]?.value ?? 0;
    if (rt > 0.05) { throttle = rt; }
    if (lt > 0.05) { throttle = -lt; reverse = true; }

    if (gp.buttons[0]?.pressed) jump         = true;
    if (gp.buttons[1]?.pressed) resetPressed = true;
    if (gp.buttons[2]?.pressed) boost        = true;
    if (gp.buttons[5]?.pressed) drift        = true;
  }

  steer = THREE.MathUtils.clamp(steer, -1, 1);

  const input = { throttle, steer, boost, drift, jump, reverse };

  // ── Reset logic ───────────────────────────────────────────────────────────
  if (resetPressed && !resetLatch) {
    resetLatch = true;
    resetCar(car, arena.spawn);
    if (race.finished) resetRace(race);
  }
  if (!resetPressed) resetLatch = false;

  // ── Race & car update ─────────────────────────────────────────────────────
  updateRace(race, car.position, dt);
  const raceActive = isRaceActive(race);
  updateCar(car, input, arena.trackMesh, dt, raceActive);

  // ── Boost pads ────────────────────────────────────────────────────────────
  for (const pad of arena.boostPads) {
    pad.material.uniforms.uTime.value += dt;
    pad.cooldown = Math.max(0, pad.cooldown - dt);
    if (pad.cooldown <= 0 && car.position.distanceTo(pad.position) < pad.radius) {
      applyBoostPad(car);
      pad.cooldown = 1.5;
    }
  }

  // ── Chase camera ──────────────────────────────────────────────────────────
  const fwd = new THREE.Vector3(Math.sin(car.heading), 0, Math.cos(car.heading));
  const targetPos  = car.position.clone().addScaledVector(fwd, -11).add(new THREE.Vector3(0, 4.4, 0));
  const targetLook = car.position.clone().addScaledVector(fwd,  7).add(new THREE.Vector3(0, 1.2, 0));

  const alpha = 1 - Math.exp(-6 * dt);
  camPos.lerp(targetPos, alpha);
  camLookAt.lerp(targetLook, alpha);

  camera.position.copy(camPos);
  camera.lookAt(camLookAt);

  // FOV widen toward 88 while boosting, relax back to 78.
  const isBoosting = input.boost && car.boost > 0 && raceActive;
  camFov = THREE.MathUtils.lerp(camFov, isBoosting ? 88 : 78, 1 - Math.exp(-4 * dt));
  camera.fov = camFov;
  camera.updateProjectionMatrix();

  // ── HUD ───────────────────────────────────────────────────────────────────
  updateHUD(hud, race, car, dt);

  // ── Render ────────────────────────────────────────────────────────────────
  composer.render();
}

frame();
