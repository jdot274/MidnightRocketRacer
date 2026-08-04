/**
 * src/hud.js — fully 3D diegetic HUD (Spline-Hana style)
 * All panels are camera-space meshes; no DOM HUD elements are touched.
 */
import * as THREE from 'three';
import { getSpeedKph } from './car.js';

const C = {
  cyan:      '#00a2ff',
  lime:      '#57ff6b',
  pink:      '#ff1f6e',
  white:     '#eaf4ff',
  cyanGlow:  'rgba(0,162,255,0.88)',
  pinkGlow:  'rgba(255,31,110,0.88)',
  limeGlow:  'rgba(87,255,107,0.88)',
};

// ---------- helpers ----------------------------------------------------------

function makeCanvasTex(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return { canvas, ctx, texture };
}

function glow(ctx, color, blur) {
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
}

/** Frosted glass slab panel. */
function glassPanel(w, h) {
  const mat = new THREE.MeshPhysicalMaterial({
    color:       new THREE.Color(0xddeeff),
    transmission: 0.92,
    thickness:    0.35,
    roughness:    0.55,
    ior:          1.2,
    transparent:  true,
    opacity:      0.98,
    side:         THREE.DoubleSide,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
}

/** Canvas-texture overlay quad (for neon text). */
function textQuad(w, h, cw, ch) {
  const ct  = makeCanvasTex(cw, ch);
  const mat = new THREE.MeshBasicMaterial({
    map:        ct.texture,
    transparent: true,
    depthWrite:  false,
    side:        THREE.DoubleSide,
  });
  return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat), ct };
}

// ---------- draw routines (only called when text actually changes) ----------

function drawSpeed(ct, speedStr) {
  const { canvas, ctx, texture } = ct;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';

  ctx.textBaseline = 'middle';
  glow(ctx, C.cyanGlow, 34);
  ctx.fillStyle = C.cyan;
  ctx.font = '800 108px "Segoe UI",system-ui,sans-serif';
  ctx.fillText(speedStr, canvas.width / 2, 105);

  ctx.textBaseline = 'top';
  glow(ctx, C.cyanGlow, 14);
  ctx.fillStyle = 'rgba(0,162,255,0.75)';
  ctx.font = '600 36px "Segoe UI",system-ui,sans-serif';
  ctx.fillText('KM/H', canvas.width / 2, 172);

  texture.needsUpdate = true;
}

function drawRacePanel(ct, gateLabel, timer) {
  const { canvas, ctx, texture } = ct;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';

  ctx.textBaseline = 'middle';
  glow(ctx, C.pinkGlow, 28);
  ctx.fillStyle = C.pink;
  ctx.font = '700 58px "Segoe UI",system-ui,sans-serif';
  ctx.fillText(gateLabel, canvas.width / 2, 80);

  glow(ctx, 'rgba(234,244,255,0.65)', 18);
  ctx.fillStyle = C.white;
  ctx.font = '600 50px "Segoe UI",system-ui,sans-serif';
  ctx.fillText(timer, canvas.width / 2, 178);

  texture.needsUpdate = true;
}

function drawCenter(ct, big, sub) {
  const { canvas, ctx, texture } = ct;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  glow(ctx, C.pinkGlow, 64);
  ctx.fillStyle = C.pink;
  ctx.font = '900 200px "Segoe UI",system-ui,sans-serif';
  ctx.fillText(big, canvas.width / 2, canvas.height * 0.42);

  glow(ctx, 'rgba(159,180,216,0.75)', 18);
  ctx.fillStyle = '#9fb4d8';
  ctx.font = '600 44px "Segoe UI",system-ui,sans-serif';
  ctx.fillText(sub, canvas.width / 2, canvas.height * 0.74);

  texture.needsUpdate = true;
}

// ---------- public API -------------------------------------------------------

/**
 * createHUD(scene, camera) → hud
 * Attaches a camera-space group that floats the 3D cockpit panels in front of
 * the lens. Calls scene.add(camera) so the camera's children are rendered.
 */
export function createHUD(scene, camera) {
  // Camera must be in the scene graph for its children to be rendered.
  scene.add(camera);

  const root = new THREE.Group();
  root.position.set(0, 0, -3.2);
  camera.add(root);

  // ── LEFT PANEL: Speed ─────────────────────────────────────────────────────
  const leftGroup = new THREE.Group();
  leftGroup.position.set(-0.80, -0.50, 0);
  leftGroup.rotation.y = THREE.MathUtils.degToRad(12);
  root.add(leftGroup);

  const leftGlass = glassPanel(0.90, 0.46);
  leftGlass.position.set(0, 0.03, 0);
  leftGroup.add(leftGlass);

  const speedQ = textQuad(0.82, 0.36, 512, 256);
  speedQ.mesh.position.set(0, 0.07, 0.005);
  leftGroup.add(speedQ.mesh);

  // Boost bar trough (dark backing).
  const boostBg = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.024, 0.008),
    new THREE.MeshStandardMaterial({ color: 0x0d1f14, transparent: true, opacity: 0.80 })
  );
  boostBg.position.set(0, -0.20, 0.003);
  leftGroup.add(boostBg);

  // Boost bar fill.
  // geometry.translate shifts mesh-local origin to the LEFT edge of the bar,
  // so scale.x shrinks the bar from left→right (not center-out).
  const fillGeo = new THREE.BoxGeometry(0.72, 0.024, 0.010);
  fillGeo.translate(0.36, 0, 0); // origin now at left edge of bar
  const boostFill = new THREE.Mesh(
    fillGeo,
    new THREE.MeshStandardMaterial({
      color:             0x000000,
      emissive:          new THREE.Color(0x57ff6b),
      emissiveIntensity: 2.8,
    })
  );
  // Position so left edge of bar sits at x = -0.36 (local to leftGroup),
  // right edge at +0.36 when fully charged.
  boostFill.position.set(-0.36, -0.20, 0.005);
  leftGroup.add(boostFill);

  // ── RIGHT PANEL: Gate + Timer ─────────────────────────────────────────────
  const rightGroup = new THREE.Group();
  rightGroup.position.set(0.80, -0.50, 0);
  rightGroup.rotation.y = THREE.MathUtils.degToRad(-12);
  root.add(rightGroup);

  const rightGlass = glassPanel(0.90, 0.46);
  rightGlass.position.set(0, 0.03, 0);
  rightGroup.add(rightGlass);

  const raceQ = textQuad(0.82, 0.38, 512, 256);
  raceQ.mesh.position.set(0, 0.04, 0.005);
  rightGroup.add(raceQ.mesh);

  // ── CENTER PANEL: Countdown / Finish ─────────────────────────────────────
  const centerGroup = new THREE.Group();
  centerGroup.position.set(0, 0.24, 0);
  root.add(centerGroup);

  const centerGlass = glassPanel(1.22, 0.58);
  centerGroup.add(centerGlass);

  const centerQ = textQuad(1.12, 0.50, 1024, 512);
  centerQ.mesh.position.set(0, 0, 0.005);
  centerGroup.add(centerQ.mesh);

  return {
    root,
    leftGroup,
    rightGroup,
    centerGroup,
    speedQ,
    raceQ,
    centerQ,
    boostFill,
    bobTime:     0,
    _lastSpeed:  '',
    _lastRace:   '',
    _lastCenter: '',
  };
}

/**
 * updateHUD(hud, race, car, dt)
 * Call once per frame. Drives canvas texture updates (cached by string change),
 * boost bar scale, and center-panel visibility.
 */
export function updateHUD(hud, race, car, dt) {
  // Gentle vertical bob at 0.5 Hz ±0.01 units.
  hud.bobTime += dt;
  hud.root.position.y = Math.sin(hud.bobTime * Math.PI) * 0.01; // sin(2π·0.5·t) = sin(πt)

  // ── Speed ─────────────────────────────────────────────────────────────────
  const speedStr = String(Math.round(getSpeedKph(car))).padStart(3, '0');
  if (speedStr !== hud._lastSpeed) {
    hud._lastSpeed = speedStr;
    drawSpeed(hud.speedQ.ct, speedStr);
  }

  // ── Boost bar ─────────────────────────────────────────────────────────────
  hud.boostFill.scale.x = Math.max(0.001, car.boost / 100);

  // ── Race panel ────────────────────────────────────────────────────────────
  const mins  = Math.floor(race.time / 60);
  const secs  = race.time % 60;
  const timer = `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
  const gateLabel = race.finished
    ? 'FINISH'
    : `GATE ${Math.min(race.nextGate + 1, race.gates.length)}/${race.gates.length}`;
  const raceKey = `${gateLabel}|${timer}`;
  if (raceKey !== hud._lastRace) {
    hud._lastRace = raceKey;
    drawRacePanel(hud.raceQ.ct, gateLabel, timer);
  }

  // ── Center panel ──────────────────────────────────────────────────────────
  let showCenter = false;
  let centerKey  = '';

  if (!race.started && !race.finished) {
    showCenter = true;
    const count = Math.ceil(race.countdown);
    const big   = count > 0 ? String(count) : 'GO';
    centerKey   = `cd_${big}`;
    if (centerKey !== hud._lastCenter) {
      hud._lastCenter = centerKey;
      drawCenter(hud.centerQ.ct, big, 'GET READY');
    }
  } else if (race.started && !race.finished && race.time < 1.2) {
    showCenter = true;
    centerKey  = 'go';
    if (centerKey !== hud._lastCenter) {
      hud._lastCenter = centerKey;
      drawCenter(hud.centerQ.ct, 'GO', 'FULL SEND');
    }
  } else if (race.finished) {
    showCenter = true;
    centerKey  = 'finish';
    if (centerKey !== hud._lastCenter) {
      hud._lastCenter = centerKey;
      drawCenter(hud.centerQ.ct, 'FINISH', 'PRESS R TO RESTART');
    }
  }

  hud.centerGroup.visible = showCenter;
}
