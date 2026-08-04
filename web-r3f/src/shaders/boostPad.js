// Iridescent dotted-wave boost pad shader.
// Look lineage: Joey's iridescent_dotted_wave Blender series + Refract legacy engines
// (electric blue -> magenta sweep over a dark dotted LED grid).
export const boostPadVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const boostPadFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  vec2 uv = vUv;

  // Scrolling energy wave along the pad's travel direction.
  float wave = sin(uv.y * 14.0 - uTime * 6.0) * 0.5 + 0.5;
  float sweep = smoothstep(0.0, 1.0, fract(uv.y * 2.0 - uTime * 0.9));

  // LED dot grid.
  vec2 grid = fract(uv * vec2(22.0, 30.0)) - 0.5;
  float dot_ = smoothstep(0.32, 0.08, length(grid));

  // Iridescent hue drift between the two neon colors.
  vec3 color = mix(uColorA, uColorB, wave * 0.65 + sweep * 0.35);
  float energy = dot_ * (0.35 + wave * 0.85);

  // Edge glow rails on the pad sides.
  float edge = smoothstep(0.5, 0.46, abs(uv.x - 0.5));
  energy += (1.0 - edge) * 1.4;

  gl_FragColor = vec4(color * energy * 2.2, 1.0);
}
`;
