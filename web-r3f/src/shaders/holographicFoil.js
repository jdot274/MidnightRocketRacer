// Holographic Foil — ported from Joey's Refract legacy_engines.v6.js
// Thin-film iridescent shimmer driven by fbm + view sweep. Used on car body
// and select world objects. Uniforms match the Refract contract so they can
// be driven by uHeat (boost intensity) and uFlow (speed).
export const holographicFoilVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment adapted from Refract "Holographic Foil" — clip-space vert replaced,
// fresnel rim added for edge brightening on 3D geometry.
export const holographicFoilFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
uniform float uTime;
uniform float uHeat;
uniform float uFlow;

vec3 h3(vec3 p){
  p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
  return -1.0+2.0*fract(sin(p)*43758.5453);
}
float gn(vec3 p){
  vec3 i=floor(p),f=fract(p);
  vec3 u=f*f*(3.0-2.0*f);
  return mix(
    mix(mix(dot(h3(i+vec3(0,0,0)),f-vec3(0,0,0)),dot(h3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
        mix(dot(h3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(h3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
    mix(mix(dot(h3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(h3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
        mix(dot(h3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(h3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
}
float fbm(vec3 p){
  float a=0.5,s=0.0;
  for(int i=0;i<6;i++){s+=a*gn(p);p=p*2.03+vec3(7.0);a*=0.5;}
  return s;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);

  // iridescent foil: fbm-driven cos-palette
  float a = fbm(vec3(vUv * 3.0, uTime * 0.1));
  vec3 foil = 0.5 + 0.5 * cos(6.2831 * (a * 2.0 + r * 1.5 + vec3(0.0, 0.33, 0.67) + uTime * 0.2 + uv.x * 1.5));

  float shimmer = pow(0.5 + 0.5 * sin((uv.x + uv.y) * 8.0 + uTime * 2.0), 2.0);
  vec3 col = foil * (0.5 + 0.5 * shimmer) * (0.8 + uHeat * 0.6);

  // Fresnel rim brightening on 3D geometry
  float fresnel = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), 2.8);
  col += foil * fresnel * 0.7;

  // Tint toward the midnight palette (blue-dominant, keep dark)
  col = mix(col * 0.15, col, 0.5 + 0.5 * sin(uTime * 0.3));
  col = clamp(col, 0.0, 1.0);

  float alpha = max(col.r, max(col.g, col.b));
  gl_FragColor = vec4(col, alpha * (0.6 + uHeat * 0.4));
}
`;
