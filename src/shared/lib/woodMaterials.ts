import {
  Color,
  MeshPhysicalMaterial,
  NearestFilter,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
} from "three";
import { assetUrl } from "./assetUrl";
const textures = new Map<string, Texture>();
const materials = new Map<string, MeshPhysicalMaterial>();
const loader = new TextureLoader();

// Keep original source maps in public; only GPU sampling is reduced to match the art direction.
function map(
  name: string,
  channel: "color" | "roughness" | "normal",
  floor: boolean,
) {
  const key = `${name}:${channel}`;
  const cached = textures.get(key);
  if (cached) return cached;
  const texture = loader.load(
    assetUrl(`textures/wood/${name}-${channel}.jpg`),
    (loaded) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = floor ? 384 : 256;
      const context = canvas.getContext("2d")!;
      context.drawImage(loaded.image, 0, 0, canvas.width, canvas.height);
      loaded.image = canvas;
      loaded.needsUpdate = true;
    },
  );
  texture.colorSpace = channel === "color" ? SRGBColorSpace : NoColorSpace;
  texture.magFilter = texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  if (floor) texture.repeat.set(2.4, 2.4);
  textures.set(key, texture);
  return texture;
}
export function woodSurface(color: string, floor = false) {
  const key = `${color}:${floor}`;
  const cached = materials.get(key);
  if (cached) return cached;
  const name = floor ? "parquet" : "walnut";
  const tint = floor
    ? new Color("#e8d1ae")
    : new Color(color).lerp(new Color("#ffd3b1"), 0.63);
  const material = new MeshPhysicalMaterial({
    color: tint,
    map: map(name, "color", floor),
    roughnessMap: floor ? undefined : map(name, "roughness", floor),
    normalMap: map(name, "normal", floor),
    normalScale: new Vector2(floor ? 0.22 : 0.12, floor ? 0.22 : 0.12),
    roughness: floor ? 0.88 : 0.48,
    metalness: 0,
    clearcoat: floor ? 0 : 0.42,
    clearcoatRoughness: 0.26,
    ior: 1.46,
  });
  materials.set(key, material);
  return material;
}
