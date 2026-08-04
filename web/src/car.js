import * as THREE from 'three';
import { PALETTE } from './arena.js';

const GRAVITY = -42;
const HOVER_HEIGHT = 1.35;

export function createCar(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: PALETTE.body,
    metalness: 0.9,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 5.2), bodyMaterial);
  body.position.y = 0.45;
  group.add(body);

  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 2.2),
    new THREE.MeshPhysicalMaterial({
      color: 0x02050c,
      metalness: 0.6,
      roughness: 0.05,
      clearcoat: 1.0,
    })
  );
  canopy.position.set(0, 0.95, -0.3);
  group.add(canopy);

  const stripMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(PALETTE.blue),
    emissiveIntensity: 1.8,
  });
  for (const side of [-1, 1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 4.6), stripMaterial);
    strip.position.set(side * 1.22, 0.42, 0);
    group.add(strip);
  }

  const engineGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(PALETTE.lime),
    emissiveIntensity: 1.1,
  });
  const engine = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.25), engineGlowMaterial);
  engine.position.set(0, 0.45, 2.65);
  group.add(engine);

  const boostLight = new THREE.PointLight(PALETTE.lime, 14, 18, 2);
  boostLight.position.set(0, 0.6, 3.4);
  group.add(boostLight);

  return {
    group,
    engineGlowMaterial,
    boostLight,
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    heading: 0,
    pitch: 0,
    roll: 0,
    boost: 100,
    grounded: false,
    raycaster: new THREE.Raycaster(),
  };
}

export function resetCar(car, spawn) {
  car.position.copy(spawn.position);
  car.velocity.set(0, 0, 0);
  car.heading = spawn.heading;
  car.pitch = 0;
  car.roll = 0;
  car.boost = 100;
  syncVisual(car);
}

export function updateCar(car, input, trackMesh, dt, raceActive) {
  const forward = new THREE.Vector3(Math.sin(car.heading), 0, Math.cos(car.heading));
  const right = new THREE.Vector3(forward.z, 0, -forward.x);

  // Ground probe.
  car.raycaster.set(car.position.clone().add(new THREE.Vector3(0, 3, 0)), new THREE.Vector3(0, -1, 0));
  car.raycaster.far = 14;
  const hits = car.raycaster.intersectObject(trackMesh, false);
  const hit = hits.length > 0 ? hits[0] : null;
  const groundHeight = hit ? hit.point.y : null;
  car.grounded = hit !== null && car.position.y - groundHeight < HOVER_HEIGHT + 1.1;

  const throttle = raceActive ? input.throttle : 0;
  const steer = input.steer;

  if (car.grounded) {
    // Hover spring keeps the car floating over the ribbon.
    const targetY = groundHeight + HOVER_HEIGHT;
    const springStrength = 68;
    const damping = 11;
    const displacement = targetY - car.position.y;
    car.velocity.y += (displacement * springStrength - car.velocity.y * damping) * dt;

    // Drive.
    const engine = 62;
    car.velocity.addScaledVector(forward, throttle * engine * dt);

    if (input.boost && car.boost > 0 && raceActive) {
      car.velocity.addScaledVector(forward, 105 * dt);
      car.boost = Math.max(0, car.boost - 30 * dt);
    } else {
      car.boost = Math.min(100, car.boost + 7 * dt);
    }

    // Steering scales with speed for arcade snap.
    const speed = car.velocity.length();
    const steerRate = 1.9 * THREE.MathUtils.clamp(speed / 32, 0.25, 1.35);
    car.heading -= steer * steerRate * dt * (input.reverse ? -1 : 1);

    // Lateral grip; drift slackens it and adds yaw energy.
    const lateral = car.velocity.dot(right);
    const grip = input.drift ? 1.6 : 9.0;
    car.velocity.addScaledVector(right, -lateral * grip * dt);
    if (input.drift) {
      car.heading -= steer * 1.15 * dt;
    }

    // Rolling resistance.
    car.velocity.multiplyScalar(1 - 0.28 * dt);

    if (input.jump && !car.jumpLatch) {
      car.velocity.y = 22;
      car.jumpLatch = true;
    }
  } else {
    car.velocity.y += GRAVITY * dt;
    // Aerial control.
    car.heading -= steer * 1.35 * dt;
    car.pitch = THREE.MathUtils.lerp(car.pitch, throttle * -0.35, dt * 3);
  }

  if (!input.jump) {
    car.jumpLatch = false;
  }

  car.position.addScaledVector(car.velocity, dt);

  // Visual lean.
  const speedRatio = THREE.MathUtils.clamp(car.velocity.length() / 70, 0, 1);
  car.roll = THREE.MathUtils.lerp(car.roll, -steer * (0.22 + speedRatio * 0.3), dt * 6);
  if (car.grounded) {
    car.pitch = THREE.MathUtils.lerp(car.pitch, 0, dt * 5);
  }

  // Boost visuals.
  const boosting = input.boost && car.boost > 0 && raceActive;
  car.engineGlowMaterial.emissiveIntensity = THREE.MathUtils.lerp(
    car.engineGlowMaterial.emissiveIntensity,
    boosting ? 4.5 : 1.1,
    dt * 8
  );
  car.boostLight.intensity = THREE.MathUtils.lerp(car.boostLight.intensity, boosting ? 320 : 60, dt * 8);

  syncVisual(car);
}

export function applyBoostPad(car) {
  const forward = new THREE.Vector3(Math.sin(car.heading), 0, Math.cos(car.heading));
  car.velocity.addScaledVector(forward, 26);
  car.boost = Math.min(100, car.boost + 35);
}

export function getSpeedKph(car) {
  return car.velocity.length() * 3.6;
}

function syncVisual(car) {
  car.group.position.copy(car.position);
  car.group.rotation.set(car.pitch, car.heading + Math.PI, car.roll, 'YXZ');
}
