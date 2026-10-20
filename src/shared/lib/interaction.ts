import type { ThreeEvent } from "@react-three/fiber";
export function clickable(
  action: () => void,
  onHover?: (label: string | null) => void,
  label = "",
) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      action();
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
      onHover?.(label);
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
      onHover?.(null);
    },
  };
}
