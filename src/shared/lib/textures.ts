import {
  CanvasTexture,
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
  MeshStandardMaterial,
} from "three";
import { photoSurface } from "./photoMaterials";
import { woodSurface } from "./woodMaterials";
type Kind =
  | "wood"
  | "floor"
  | "wall"
  | "cloth"
  | "rug"
  | "sofa"
  | "paint"
  | "picture"
  | "speaker";
const textures = new Map<string, CanvasTexture>();
function random(seed: number) {
  let n = seed;
  return () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
export function pixelTexture(kind: Kind, color: string) {
  const key = `${kind}:${color}`;
  const existing = textures.get(key);
  if (existing) return existing;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 128, 128);
  const rng = random(61);
  for (let y = 0; y < 128; y++)
    for (let x = 0; x < 128; x++) {
      const a =
        (rng() - 0.5) *
        (kind === "wall" || kind === "paint" || kind === "floor"
          ? 0.025
          : 0.16);
      ctx.fillStyle = a > 0 ? `rgba(255,238,204,${a})` : `rgba(24,17,13,${-a})`;
      ctx.fillRect(x, y, 1, 1);
    }
  if (kind === "floor") {
    ctx.fillStyle = "#dfd0ae0c";
    for (let i = 0; i < 600; i++) ctx.fillRect(rng() * 128, rng() * 128, 2, 1);
  }
  if (kind === "wall") {
    ctx.fillStyle = "#9aa78e11";
    for (let x = 8; x < 128; x += 16) {
      ctx.fillRect(x, 0, 1, 128);
      for (let y = 8; y < 128; y += 24) {
        ctx.fillRect(x - 2, y, 5, 2);
        ctx.fillRect(x, y - 3, 1, 8);
      }
    }
  }
  if (kind === "rug") {
    ctx.strokeStyle = "#bba276";
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, 118, 118);
    ctx.strokeRect(12, 12, 104, 104);
    for (let x = 26; x < 114; x += 24)
      for (let y = 26; y < 114; y += 24) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "#b7a17c";
        ctx.fillRect(-6, -6, 12, 12);
        ctx.fillStyle = "#413c2b";
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
      }
  }
  if (kind === "sofa") {
    ctx.fillStyle = "#b5a17c33";
    for (let x = 0; x < 128; x += 8)
      for (let y = 0; y < 128; y += 8) ctx.fillRect(x, y, 3, 2);
  }
  if (kind === "cloth") {
    ctx.fillStyle = "#ffffff18";
    for (let x = 0; x < 128; x += 3) ctx.fillRect(x, 0, 1, 128);
  }
  if (kind === "speaker") {
    ctx.fillStyle = "#343a2a";
    for (let y = 1; y < 128; y += 4)
      for (let x = y % 8 ? 1 : 3; x < 128; x += 4) ctx.fillRect(x, y, 2, 2);
  }
  if (kind === "picture") {
    ctx.fillStyle = "#6c7c79";
    ctx.fillRect(0, 0, 128, 70);
    ctx.fillStyle = "#9a9c7c";
    ctx.fillRect(0, 70, 128, 58);
    ctx.fillStyle = "#384b42";
    for (let i = 0; i < 12; i++) {
      const x = rng() * 128;
      const h = 24 + rng() * 45;
      ctx.fillRect(x, 75 - h, 4, h);
      for (let j = 0; j < 5; j++)
        ctx.fillRect(x - j * 2, 75 - h + j * 8, j * 4 + 4, 5);
    }
    ctx.fillStyle = "#c8b991";
    ctx.fillRect(0, 98, 128, 8);
    ctx.fillStyle = "#a0b5ac";
    ctx.fillRect(0, 106, 128, 22);
  }
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  map.magFilter = map.minFilter = NearestFilter;
  map.wrapS = map.wrapT = RepeatWrapping;
  map.generateMipmaps = false;
  textures.set(key, map);
  return map;
}
const materials = new Map<string, MeshStandardMaterial>();
export function surface(kind: Kind, color: string) {
  if (kind === "wood") return woodSurface(color);
  if (kind === "cloth" || kind === "sofa" || kind === "rug")
    return photoSurface(kind, color);
  const key = `${kind}:${color}`;
  let m = materials.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      map: pixelTexture(kind, color),
      roughness: 0.93,
    });
    materials.set(key, m);
  }
  return m;
}
