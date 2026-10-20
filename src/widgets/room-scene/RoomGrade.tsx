import { useEffect, useMemo } from "react";
import { Effect } from "postprocessing";

const fragmentShader = /* glsl */ `
  float orderedNoise(vec2 p) {
    vec2 q = mod(floor(p), 4.0);
    float a = mod(q.x, 2.0) * 2.0 + mod(q.y, 2.0);
    float b = floor(q.x / 2.0) * 2.0 + floor(q.y / 2.0);
    return (a * 4.0 + b) / 16.0 - 0.5;
  }
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 tint = mix(vec3(0.95, 0.99, 1.035), vec3(1.045, 1.005, 0.95), smoothstep(0.06, 0.9, luminance));
    color = (color * tint - 0.18) * 1.045 + 0.18;
    color += orderedNoise(gl_FragCoord.xy) / 330.0;
    outputColor = vec4(max(color, vec3(0.0)), inputColor.a);
  }
`;

/** Warm highlights, cooler shadows and fine ordered film grain. */
export function RoomGrade() {
  const effect = useMemo(() => new Effect("RoomGrade", fragmentShader), []);
  useEffect(() => () => effect.dispose(), [effect]);
  return <primitive object={effect} dispose={null} />;
}
