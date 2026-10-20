import {
  CanvasTexture,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

export function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
function foodMap(kind: "crumb" | "crust" | "peel" | "skin", bump = false) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const random = seeded(813);
  ctx.fillStyle = bump
    ? "#aaaaaa"
    : { crumb: "#e7d1a1", crust: "#995b2d", peel: "#d57a22", skin: "#81918f" }[
        kind
      ];
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 6500; i++) {
    const x = random() * 256,
      y = random() * 256,
      r = kind === "crumb" ? 0.35 + random() * 1.9 : 0.3 + random() * 0.8;
    ctx.fillStyle = bump
      ? `rgba(20,20,20,${0.1 + random() * 0.65})`
      : kind === "crumb"
        ? `rgba(102,64,27,${0.1 + random() * 0.35})`
        : kind === "crust"
          ? `rgba(55,29,9,${random() * 0.3})`
          : kind === "peel"
            ? `rgba(106,52,12,${random() * 0.28})`
            : `rgba(32,47,47,${random() * 0.22})`;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      r,
      kind === "skin" ? r * 3 : r * 0.7,
      random() * 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  const map = new CanvasTexture(canvas);
  if (!bump) map.colorSpace = SRGBColorSpace;
  map.minFilter = map.magFilter = NearestFilter;
  map.wrapS = map.wrapT = RepeatWrapping;
  map.generateMipmaps = false;
  return map;
}
export const foodMaterials = {
  ceramic: new MeshPhysicalMaterial({
    color: "#dcded5",
    roughness: 0.27,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
  }),
  rim: new MeshStandardMaterial({
    color: "#617c83",
    roughness: 0.35,
    metalness: 0.1,
  }),
  metal: new MeshStandardMaterial({
    color: "#c1c5bc",
    roughness: 0.28,
    metalness: 0.8,
  }),
  crumb: new MeshStandardMaterial({
    map: foodMap("crumb"),
    bumpMap: foodMap("crumb", true),
    bumpScale: 0.0013,
    roughness: 0.87,
  }),
  crust: new MeshStandardMaterial({
    map: foodMap("crust"),
    bumpMap: foodMap("crust", true),
    bumpScale: 0.001,
    roughness: 0.72,
  }),
  sugar: new MeshPhysicalMaterial({
    color: "#f4f1e5",
    roughness: 0.19,
    clearcoat: 1,
    metalness: 0.05,
  }),
  peel: new MeshStandardMaterial({
    map: foodMap("peel"),
    bumpMap: foodMap("peel", true),
    bumpScale: 0.0014,
    roughness: 0.52,
  }),
  pith: new MeshStandardMaterial({ color: "#ead8ad", roughness: 0.85 }),
  skin: new MeshPhysicalMaterial({
    map: foodMap("skin"),
    bumpMap: foodMap("skin", true),
    bumpScale: 0.0004,
    roughness: 0.27,
    metalness: 0.38,
    clearcoat: 0.8,
  }),
  flesh: new MeshStandardMaterial({ color: "#b8a59b", roughness: 0.38 }),
  onion: new MeshPhysicalMaterial({
    color: "#d8d9bf",
    roughness: 0.28,
    clearcoat: 0.45,
  }),
  mayonnaise: new MeshStandardMaterial({ color: "#cdc6a7", roughness: 0.65 }),
  ingredients: new MeshStandardMaterial({ roughness: 0.6 }),
  rice: new MeshStandardMaterial({ color: "#c5c0b3", roughness: 0.65 }),
  glass: new MeshPhysicalMaterial({
    color: "#d1dcd1",
    transparent: true,
    opacity: 0.28,
    roughness: 0.15,
    metalness: 0,
    depthWrite: false,
  }),
  tea: new MeshStandardMaterial({ color: "#69452a", roughness: 0.2 }),
  bottle: new MeshPhysicalMaterial({
    color: "#52623b",
    roughness: 0.2,
    clearcoat: 0.75,
  }),
};
