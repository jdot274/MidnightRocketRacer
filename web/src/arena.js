import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { boostPadVertex, boostPadFragment } from './shaders/boostPad.js';
import { trackEnergyVertex, trackEnergyFragment } from './shaders/trackEnergy.js';

export const PALETTE = {
  ink: 0x05060a,
  blue: 0x00a2ff,
  pink: 0xff1f6e,
  lime: 0x57ff6b,
  body: 0x0a0c12,
};

const TRACK_WIDTH = 26;

export function createArena(scene) {
  const group = new THREE.Group();
  scene.add(group);

  scene.background = new THREE.Color(PALETTE.ink);
  scene.fog = new THREE.FogExp2(PALETTE.ink, 0.0016);

  // Closed sweeping circuit with elevation.
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(150, 3, 0),
      new THREE.Vector3(260, 12, 60),
      new THREE.Vector3(300, 30, 180),
      new THREE.Vector3(220, 42, 300),
      new THREE.Vector3(80, 34, 360),
      new THREE.Vector3(-60, 22, 300),
      new THREE.Vector3(-120, 10, 160),
      new THREE.Vector3(-60, 4, 40),
    ],
    true,
    'catmullrom',
    0.35
  );

  const trackMesh = buildRibbon(curve, TRACK_WIDTH);
  group.add(trackMesh);

  // One-off iridescent dotted-wave energy overlay riding the ribbon.
  const trackEnergyMaterial = new THREE.ShaderMaterial({
    vertexShader: trackEnergyVertex,
    fragmentShader: trackEnergyFragment,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const trackOverlay = new THREE.Mesh(trackMesh.geometry, trackEnergyMaterial);
  trackOverlay.position.y = 0.06;
  group.add(trackOverlay);

  const rails = buildRails(curve, TRACK_WIDTH);
  rails.forEach((rail) => group.add(rail));

  // Mirror-black floor plane far below the ribbon.
  const floor = new Reflector(new THREE.PlaneGeometry(2600, 2600), {
    clipBias: 0.003,
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0x0a0d14,
  });
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -6;
  group.add(floor);

  const boostPads = [0.06, 0.3, 0.55, 0.8].map((t) => makeBoostPad(curve, t, group));
  const gates = buildGates(curve, group);
  addLighting(group);

  const spawn = getSpawn(curve, 0.005);

  return { group, curve, trackMesh, trackEnergyMaterial, boostPads, gates, spawn };
}

function buildRibbon(curve, width) {
  const segments = 420;
  const positions = [];
  const uvs = [];
  const indices = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(up, tangent).normalize();
    const half = side.multiplyScalar(width / 2);
    positions.push(point.x - half.x, point.y, point.z - half.z);
    positions.push(point.x + half.x, point.y, point.z + half.z);
    uvs.push(0, t * 40, 1, t * 40);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x0b0e16,
    metalness: 0.85,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.15,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.isTrack = true;
  return mesh;
}

function buildRails(curve, width) {
  const offsets = [-(width / 2 + 1.2), width / 2 + 1.2];
  const colors = [PALETTE.blue, PALETTE.pink];
  const up = new THREE.Vector3(0, 1, 0);

  return offsets.map((offset, index) => {
    const points = [];
    const samples = 360;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const side = new THREE.Vector3().crossVectors(up, tangent).normalize();
      points.push(point.clone().addScaledVector(side, offset).add(new THREE.Vector3(0, 0.9, 0)));
    }
    const railCurve = new THREE.CatmullRomCurve3(points, true);
    const geometry = new THREE.TubeGeometry(railCurve, 420, 0.18, 8, true);
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(colors[index]),
      emissiveIntensity: 1.6,
    });
    return new THREE.Mesh(geometry, material);
  });
}

function makeBoostPad(curve, t, group) {
  const point = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t);
  const angle = Math.atan2(tangent.x, tangent.z);

  const material = new THREE.ShaderMaterial({
    vertexShader: boostPadVertex,
    fragmentShader: boostPadFragment,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTE.blue) },
      uColorB: { value: new THREE.Color(PALETTE.pink) },
    },
  });

  const pad = new THREE.Mesh(new THREE.PlaneGeometry(10, 22), material);
  pad.rotation.x = -Math.PI / 2;
  pad.rotation.z = -angle;
  pad.position.copy(point).add(new THREE.Vector3(0, 0.25, 0));
  group.add(pad);

  return { mesh: pad, material, position: pad.position.clone(), radius: 12, cooldown: 0 };
}

function buildGates(curve, group) {
  const gateParams = [0.22, 0.46, 0.72, 0.985];
  const up = new THREE.Vector3(0, 1, 0);

  return gateParams.map((t, index) => {
    const isFinish = index === gateParams.length - 1;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(up, tangent).normalize();
    const color = isFinish ? PALETTE.lime : index % 2 === 0 ? PALETTE.blue : PALETTE.pink;

    const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, 22, 12);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(color),
      emissiveIntensity: 1.5,
    });

    for (const direction of [-1, 1]) {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.copy(point).addScaledVector(side, direction * (TRACK_WIDTH / 2 + 2.4));
      pillar.position.y += 11;
      group.add(pillar);
    }

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(TRACK_WIDTH + 6, 0.6, 0.6),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: new THREE.Color(color),
        emissiveIntensity: 1.8,
      })
    );
    beam.position.copy(point);
    beam.position.y += 22;
    beam.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
    group.add(beam);

    return { position: point.clone(), radius: TRACK_WIDTH / 2 + 6, index, isFinish };
  });
}

function addLighting(group) {
  const ambient = new THREE.AmbientLight(0x1a2030, 0.7);
  group.add(ambient);

  const key = new THREE.DirectionalLight(0x8fb8ff, 0.85);
  key.position.set(-180, 320, -140);
  group.add(key);

  const glowPoints = [
    [120, 90, 60, PALETTE.blue],
    [240, 110, 260, PALETTE.pink],
    [-80, 80, 240, PALETTE.lime],
  ];
  for (const [x, y, z, color] of glowPoints) {
    const light = new THREE.PointLight(color, 14000, 620, 2);
    light.position.set(x, y, z);
    group.add(light);
  }
}

function getSpawn(curve, t) {
  const point = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t);
  return {
    position: point.clone().add(new THREE.Vector3(0, 2.2, 0)),
    heading: Math.atan2(tangent.x, tangent.z),
  };
}
