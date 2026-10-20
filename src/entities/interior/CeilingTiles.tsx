import { useMemo } from "react";
import {
  CanvasTexture,
  MeshStandardMaterial,
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";
export function CeilingTiles() {
  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const pixels = ctx.createImageData(128, 128);
    for (let y = 0; y < 128; y++)
      for (let x = 0; x < 128; x++) {
        const u = x / 127,
          v = y / 127;
        const border = Math.min(u, v, 1 - u, 1 - v);
        const relief = Math.pow(
          Math.sin(((u * 2) % 1) * Math.PI) * Math.sin(((v * 2) % 1) * Math.PI),
          0.7,
        );
        const value =
          border < 0.018
            ? 70
            : border < 0.035
              ? 195
              : Math.round(110 + relief * 90);
        const i = (y * 128 + x) * 4;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
        pixels.data[i + 3] = 255;
      }
    ctx.putImageData(pixels, 0, 0);
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = colorCanvas.height = 128;
    const colorContext = colorCanvas.getContext("2d")!;
    const colorPixels = colorContext.createImageData(128, 128);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const value = 218 + Math.round((pixels.data[i] - 110) * 0.16);
      colorPixels.data[i] = value + 2;
      colorPixels.data[i + 1] = value + 2;
      colorPixels.data[i + 2] = value - 3;
      colorPixels.data[i + 3] = 255;
    }
    colorContext.putImageData(colorPixels, 0, 0);
    const colorMap = new CanvasTexture(colorCanvas);
    colorMap.colorSpace = SRGBColorSpace;
    colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.set(11.9, 12.5);
    colorMap.minFilter = colorMap.magFilter = NearestFilter;
    colorMap.generateMipmaps = false;
    const map = new CanvasTexture(canvas);
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(11.9, 12.5);
    map.magFilter = map.minFilter = NearestFilter;
    map.generateMipmaps = false;
    return new MeshStandardMaterial({
      color: "#f1f0e7",
      map: colorMap,
      roughness: 0.88,
      bumpMap: map,
      bumpScale: 0.025,
    });
  }, []);
  return (
    <mesh
      position={[0, 2.713, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      material={material}
      receiveShadow
    >
      <planeGeometry args={[5.36, 5.63]} />
    </mesh>
  );
}
