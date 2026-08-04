// One-off track energy overlay — unique to the Midnight ribbon circuit.
// Lineage: Joey's iridescent dotted-wave series. A dark LED dot-matrix breathes
// beneath the racing line; a soft iridescent current flows down-track, and the
// centerline carries a faint pulse so speed always has a visual heartbeat.
export const trackEnergyVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const trackEnergyFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;

vec3 iridescence(float phase) {
  // Blue -> violet -> magenta sweep, never leaving the midnight family.
  return vec3(
    0.05 + 0.25 * sin(phase + 4.7),
    0.35 + 0.45 * sin(phase + 2.2),
    0.75 + 0.25 * sin(phase)
  );
}

void main() {
  // vUv.y runs along the track (0..40 wrapped), vUv.x across it.
  vec2 uv = vec2(vUv.x, fract(vUv.y));

  // LED dot matrix, denser across than along.
  vec2 cell = fract(vec2(uv.x * 30.0, vUv.y * 160.0)) - 0.5;
  float dot_ = smoothstep(0.34, 0.12, length(cell));

  // Slow current flowing down-track; each dot inherits the current's phase.
  float current = sin(vUv.y * 24.0 - uTime * 1.6) * 0.5 + 0.5;
  float shimmer = sin(vUv.y * 90.0 - uTime * 5.0 + uv.x * 6.0) * 0.5 + 0.5;

  vec3 color = iridescence(vUv.y * 12.0 - uTime * 0.8);
  float energy = dot_ * (0.045 + current * 0.12 + shimmer * 0.05);

  // Racing-line pulse down the center.
  float center = smoothstep(0.22, 0.0, abs(uv.x - 0.5));
  float pulse = pow(max(0.0, sin(vUv.y * 6.0 - uTime * 2.4)), 6.0);
  energy += center * pulse * 0.35;

  // Edge feather so the overlay dies before the rails.
  float feather = smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x);

  gl_FragColor = vec4(color * energy * feather, energy * feather);
}
`;
