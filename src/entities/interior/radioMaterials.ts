import {
  CanvasTexture,
  MeshStandardMaterial,
  NearestFilter,
  SRGBColorSpace,
} from "three";

function receiverFace() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 660;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#b8b9aa";
  ctx.fillRect(0, 0, 1024, 660);
  ctx.fillStyle = "#242a26";
  ctx.fillRect(12, 18, 1000, 283);
  ctx.strokeStyle = "#929a86";
  ctx.lineWidth = 3;
  ctx.strokeRect(94, 30, 646, 255);
  ctx.strokeRect(768, 30, 228, 255);
  const bands = ["ДВ", "СВ", "КВ I", "КВ II", "КВ III", "КВ IV", "КВ V"];
  ctx.font = "18px monospace";
  bands.forEach((band, row) => {
    const y = 55 + row * 31;
    ctx.fillStyle = row > 1 ? "#acb6a0" : "#d7c58d";
    ctx.fillText(band, 105, y + 5);
    ctx.strokeStyle = row > 1 ? "#88977b" : "#c3b276";
    ctx.beginPath();
    ctx.moveTo(184, y + 7);
    ctx.lineTo(719, y + 7);
    ctx.stroke();
    for (let i = 0; i <= 35; i++) {
      const x = 184 + i * 15;
      ctx.beginPath();
      ctx.moveTo(x, y + 7);
      ctx.lineTo(x, y + (i % 5 === 0 ? -9 : 0));
      ctx.stroke();
    }
  });
  ctx.fillStyle = "#cccfc0";
  ctx.font = "bold 35px monospace";
  ctx.fillText("VEF 202", 795, 112);
  ctx.font = "15px monospace";
  ctx.fillText("ДВ · СВ · КВ", 790, 215);
  ctx.fillText("НАСТРОЙКА", 801, 247);
  ctx.fillStyle = "#898d7f";
  ctx.fillRect(23, 322, 978, 312);
  for (let row = 0; row < 33; row++)
    for (let col = 0; col < 127; col++) {
      const x = 27 + col * 7.7 + (row % 2) * 3.8,
        y = 327 + row * 9.2;
      ctx.fillStyle = (row + col) % 5 === 0 ? "#41473e" : "#525a4e";
      ctx.fillRect(x, y, 3, 5);
    }
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  map.minFilter = map.magFilter = NearestFilter;
  map.generateMipmaps = false;
  return new MeshStandardMaterial({ map, roughness: 0.62, metalness: 0.12 });
}
export const radioMaterials = {
  face: receiverFace(),
  plastic: new MeshStandardMaterial({ color: "#252b28", roughness: 0.54 }),
  trim: new MeshStandardMaterial({
    color: "#c1c5b8",
    metalness: 0.65,
    roughness: 0.33,
  }),
  knob: new MeshStandardMaterial({
    color: "#e0dfcb",
    metalness: 0.48,
    roughness: 0.3,
  }),
  grille: new MeshStandardMaterial({
    color: "#b6bbab",
    metalness: 0.42,
    roughness: 0.58,
  }),
};
