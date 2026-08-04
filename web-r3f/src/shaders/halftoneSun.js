// Halftone Sun — dot-matrix disc shader for distant horizon "suns".
// Derived from Joey's Refract "Halftone" engine but adapted for 3D disc
// geometry: concentric rings of dots with color cycling by angle and radius.
// Two color modes: MODE_BLUE (electric blue dominant) and MODE_PINK (magenta).

export const halftoneSunVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const halftoneSunFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uHeat;
uniform float uMode; // 0 = blue, 1 = pink/magenta

vec3 h3(vec3 p){
  p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
  return -1.0+2.0*fract(sin(p)*43758.5453);
}
float gn(vec3 p){
  vec3 i=floor(p),f=fract(p);vec3 u=f*f*(3.0-2.0*f);
  return mix(
    mix(mix(dot(h3(i+vec3(0,0,0)),f-vec3(0,0,0)),dot(h3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
        mix(dot(h3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(h3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
    mix(mix(dot(h3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(h3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
        mix(dot(h3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(h3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){s+=a*gn(p);p=p*2.03+vec3(7.0);a*=0.5;}return s;}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float ang = atan(uv.y, uv.x);

  // Subtle fbm warp for organic feel
  float field = fbm(vec3(uv * 1.2, uTime * 0.08)) * 0.5 + 0.5;
  field *= smoothstep(1.1, 0.1, r);

  // Concentric ring structure (5 rings tighten toward center)
  float rings = sin(r * 18.0 - uTime * 0.35) * 0.5 + 0.5;
  rings = mix(rings, field, 0.4);

  // Halftone dot grid — denser toward center
  float dotScale = mix(24.0, 12.0, r);
  vec2 g = fract(uv * dotScale) - 0.5;
  float dt = smoothstep(rings * 0.52, rings * 0.52 - 0.1, length(g));

  // Color selection: blue or pink dominant, cycling with angle and time
  vec3 cBlue = vec3(0.0, 0.64, 1.0);
  vec3 cPink = vec3(1.0, 0.12, 0.43);
  vec3 cCyan = vec3(0.0, 0.88, 0.88);

  vec3 col;
  float hue = ang / 6.2831 + 0.5 + uTime * 0.04;
  if (uMode < 0.5) {
    // Blue mode: blue → cyan gradient with magenta accents
    col = mix(cBlue, cCyan, 0.5 + 0.5 * sin(hue * 4.0 + r * 3.0));
    col = mix(col, cPink, 0.12 * (0.5 + 0.5 * sin(hue * 7.0)));
  } else {
    // Pink mode: magenta → blue gradient
    col = mix(cPink, cBlue, 0.5 + 0.5 * sin(hue * 4.0 + r * 3.0));
    col = mix(col, cCyan, 0.08 * (0.5 + 0.5 * sin(hue * 9.0)));
  }

  // Radial fade + dot mask
  float fade = smoothstep(1.05, 0.05, r);
  col = col * dt * (0.9 + uHeat * 0.3) * fade;

  float alpha = (col.r + col.g + col.b) > 0.0 ? fade * 0.85 : 0.0;
  gl_FragColor = vec4(col, alpha);
}
`;
