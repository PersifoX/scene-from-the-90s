import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, NearestFilter } from "three";
import { assetUrl } from "../../shared/lib/assetUrl";

/** Freepoly.org CC0 model, exported at real scale with its feet at y=0. */
export function VintageComputer() {
  const { scene } = useGLTF(
    assetUrl("/models/vintage_computer/model.glb"),
    assetUrl("/decoders/draco/"),
  );
  const object = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.castShadow = node.receiveShadow = true;
      const multiple = Array.isArray(node.material);
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      const prepared = materials.map((source) => {
        const material = source.clone() as MeshStandardMaterial;
        // Retain the 1K keyboard lettering; only sampling is pixel-styled.
        if (material.map) {
          material.map.magFilter = NearestFilter;
          material.map.needsUpdate = true;
        }
        return material;
      });
      node.material = multiple ? prepared : prepared[0];
    });
    return root;
  }, [scene]);
  return <primitive object={object} dispose={null} />;
}
