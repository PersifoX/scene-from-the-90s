import { Suspense } from "react";
import { AssetModel } from "../../shared/ui/AssetModel";
import { Box } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
import { clickable } from "../../shared/lib/interaction";
import type { InteriorActions } from "./WallUnit";
import { Olivier, SugarBread, Mandarins } from "./food/FestiveDishes";
import { Kutya } from "./food/Kutya";
import { RoastDuck, NapoleonCake } from "./food/HolidayDishes";
import { Dish } from "./food/FoodGeometry";
import { Cutlery, Lemonade, TeaGlass } from "./food/Tableware";
import { TableCloth } from "./TableCloth";

function Stool({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Suspense fallback={null}>
        <AssetModel
          path="/models/painted_wooden_stool/model.gltf"
          size={[0.36, 0.46, 0.36]}
          tint="#cfbea2"
        />
      </Suspense>
    </group>
  );
}
export function FestiveTable({ inspect, hover }: InteriorActions) {
  const wood = surface("wood", "#745038");
  return (
    <group position={[-0.49, 0, 0.28]}>
      <Box position={[0, 0.765, 0]} size={[1.12, 0.075, 1.9]} material={wood} />
      {[-0.44, 0.44].flatMap((x) =>
        [-0.8, 0.8].map((z) => (
          <Box
            key={`${x}:${z}`}
            position={[x, 0.38, z]}
            size={[0.055, 0.76, 0.055]}
            material={wood}
          />
        )),
      )}
      <Box position={[0, 0.69, 0]} size={[0.93, 0.08, 0.04]} material={wood} />
      <TableCloth />
      <group
        position={[-0.17, 0.825, -0.42]}
        {...clickable(() => inspect("salad"), hover, "Оливье")}
      >
        <Olivier />
      </group>
      <group
        position={[0.27, 0.825, -0.37]}
        {...clickable(() => inspect("rice"), hover, "Кутья")}
      >
        <Kutya />
      </group>
      <group
        position={[-0.24, 0.825, 0.04]}
        {...clickable(() => inspect("duck"), hover, "Запечённая утка")}
      >
        <RoastDuck />
      </group>
      <group
        position={[0.22, 0.825, 0.11]}
        {...clickable(() => inspect("cake"), hover, "Торт «Наполеон»")}
      >
        <NapoleonCake />
      </group>
      <group
        position={[-0.25, 0.825, 0.59]}
        {...clickable(() => inspect("bread"), hover, "Хлеб с сахаром")}
      >
        <SugarBread />
      </group>
      <group
        position={[0.28, 0.825, 0.5]}
        {...clickable(() => inspect("mandarins"), hover, "Мандарины")}
      >
        <Mandarins />
      </group>
      <group
        position={[0.4, 0.825, -0.07]}
        {...clickable(() => inspect("drinks"), hover, "Лимонад и чай")}
      >
        <Lemonade />
      </group>
      {[
        [-0.4, -0.76],
        [0.36, -0.77],
        [0.37, 0.8],
      ].map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0.825, z]}>
          <Dish scale={[0.66, 0.75, 0.66]} />
          <group position={[x > 0 ? -0.13 : 0.13, 0.002, 0]}>
            <Cutlery />
          </group>
        </group>
      ))}
      {[
        [-0.2, -0.77],
        [0.03, 0.8],
      ].map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0.825, z]}>
          <TeaGlass />
        </group>
      ))}
      <Stool x={0} z={1.23} />
      <Stool x={0} z={-1.23} />
      <Stool x={-0.86} z={0.05} />
    </group>
  );
}
