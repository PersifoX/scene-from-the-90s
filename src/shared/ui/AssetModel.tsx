import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { assetUrl } from "../lib/assetUrl";
import {
  Box3,
  Color,
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
  Texture,
  Vector3,
} from "three";

const preparedTextures = new WeakSet<Texture>();
function prepareTexture(texture: Texture | null | undefined) {
  if (!texture || preparedTextures.has(texture)) return;
  const source = texture.image as HTMLImageElement;
  if (source?.width) {
    const canvas = document.createElement("canvas");
    const ratio = Math.min(1, 512 / Math.max(source.width, source.height));
    canvas.width = Math.max(1, Math.round(source.width * ratio));
    canvas.height = Math.max(1, Math.round(source.height * ratio));
    canvas
      .getContext("2d")!
      .drawImage(source, 0, 0, canvas.width, canvas.height);
    texture.image = canvas;
  }
  texture.minFilter = texture.magFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  preparedTextures.add(texture);
}
type Props = { path: string; size: [number, number, number]; tint?: string };

/** A bottom-centred, fitted clone; callers own placement and interactions. */
export function AssetModel({ path, size, tint }: Props) {
  const { scene } = useGLTF(assetUrl(path));
  const object = useMemo(() => {
    const root = scene.clone(true);
    root.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(root);
    const dimensions = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = new Vector3(
      size[0] / dimensions.x,
      size[1] / dimensions.y,
      size[2] / dimensions.z,
    );
    root.scale.copy(scale);
    root.position.set(
      -center.x * scale.x,
      -bounds.min.y * scale.y,
      -center.z * scale.z,
    );
    root.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.castShadow = node.receiveShadow = true;
      const source = Array.isArray(node.material)
        ? node.material
        : [node.material];
      const materials = source.map((original) => {
        const material = original.clone() as MeshStandardMaterial;
        for (const texture of [
          material.map,
          material.normalMap,
          material.roughnessMap,
          material.metalnessMap,
          material.aoMap,
        ])
          prepareTexture(texture);
        if (tint) material.color.multiply(new Color(tint));
        if (material.normalScale) material.normalScale.multiplyScalar(0.4);
        return material;
      });
      node.material = Array.isArray(node.material) ? materials : materials[0];
    });
    return root;
  }, [scene, size[0], size[1], size[2], tint]);
  return <primitive object={object} dispose={null} />;
}
