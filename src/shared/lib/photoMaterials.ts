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
const loader = new TextureLoader();
const maps = new Map<string, Texture>();
const materials = new Map<string, MeshPhysicalMaterial>();
function photoMap(
  url: string,
  color: boolean,
  repeat: number,
  treatment: "original" | "linen" | "upholstery" = "original",
  crop = false,
) {
  const key = `${url}:${repeat}:${treatment}`;
  const cached = maps.get(key);
  if (cached) return cached;
  const texture = loader.load(assetUrl(url), (loaded) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = crop ? 512 : 256;
    const ctx = canvas.getContext("2d")!;
    if (treatment === "linen") ctx.filter = "grayscale(1) brightness(2.6)";
    if (treatment === "upholstery")
      ctx.filter = "grayscale(1) contrast(0.38) brightness(1.55)";
    const image = loaded.image as HTMLImageElement;
    if (crop)
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 512, 512);
    else ctx.drawImage(image, 0, 0, 256, 256);
    loaded.image = canvas;
    loaded.needsUpdate = true;
  });
  texture.colorSpace = color ? SRGBColorSpace : NoColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.minFilter = texture.magFilter = NearestFilter;
  texture.generateMipmaps = false;
  maps.set(key, texture);
  return texture;
}
export function photoSurface(kind: "cloth" | "sofa" | "rug", color: string) {
  const key = kind + color;
  const cached = materials.get(key);
  if (cached) return cached;
  const prefix =
    kind === "sofa" ? "fabric" : kind === "cloth" ? "linen" : "carpet";
  const repeat = kind === "rug" ? 1 : kind === "cloth" ? 2 : 1;
  const tint =
    kind === "sofa"
      ? new Color(color)
      : kind === "rug"
        ? new Color("#bda995")
        : new Color(color);
  const material = new MeshPhysicalMaterial({
    color: tint,
    map: photoMap(
      kind === "rug"
        ? "/textures/rug/room-rug.png"
        : kind === "sofa"
          ? "/textures/fabric/sofa-jacquard.png"
          : `/textures/fabric/${prefix}-color.jpg`,
      true,
      repeat,
      kind === "cloth" ? "linen" : kind === "sofa" ? "original" : "original",
      kind === "rug",
    ),
    normalMap: photoMap(
      `/textures/fabric/${prefix}-normal.jpg`,
      false,
      kind === "rug" ? 5 : repeat,
    ),
    normalScale: new Vector2(
      kind === "rug" ? 0.18 : 0.24,
      kind === "rug" ? 0.18 : 0.24,
    ),
    roughness: 0.94,
    metalness: 0,
    sheen: kind === "sofa" ? 0.65 : kind === "cloth" ? 0.24 : 0.12,
    sheenColor: new Color("#c6c1ae"),
    sheenRoughness: 0.95,
  });
  materials.set(key, material);
  return material;
}
