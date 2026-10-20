import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderMaterial } from "three";
const vertexShader = `varying vec2 screenUV; void main(){screenUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragmentShader = `
uniform float time; uniform float power; varying vec2 screenUV;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
 vec2 uv=screenUV;
 float grain=hash(floor(uv*vec2(128.,96.))+floor(time*12.));
 float scan=mod(floor(uv.y*96.),3.)==0.?0.80:1.;
 float roll=(1.-smoothstep(0.,.035,abs(uv.y-fract(time*.045))))*.08;
 float edge=clamp(1.-pow(length((uv-.5)*1.4),2.)*.45,.4,1.);
 vec3 signal=vec3(.56,.76,.67)*(0.78+grain*.12+roll)*scan*edge*1.6;
 vec3 dark=vec3(.035,.055,.047);
 gl_FragColor=vec4(mix(dark,signal,power),1.);
}`;
export function CrtScreen({
  on,
  position = [-0.1, 0.02, 0.442],
  size = [1.12, 0.98],
}: {
  on: boolean;
  position?: [number, number, number];
  size?: [number, number];
}) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { time: { value: 0 }, power: { value: 0 } },
        toneMapped: false,
      }),
    [],
  );
  useFrame((_, delta) => {
    material.uniforms.time.value += delta;
    material.uniforms.power.value +=
      ((on ? 1 : 0) - material.uniforms.power.value) *
      (1 - Math.exp(-delta * 9));
  });
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={position} material={material}>
      <planeGeometry args={size} />
    </mesh>
  );
}
