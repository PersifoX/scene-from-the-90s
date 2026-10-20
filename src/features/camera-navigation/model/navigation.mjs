export const CAMERA_VIEWS = {
  room: {
    position: [1, 1.6, 4.1],
    target: [-0.45, 1.25, -0.45],
    fov: 68,
    zone: "room",
    label: "Вся комната",
  },
  left: {
    position: [0.5, 1.65, 0.65],
    target: [-1.98, 1.35, -0.55],
    fov: 64,
    zone: "left",
    label: "Телевизор и радио",
  },
  table: {
    position: [-0.32, 2.08, 2.1],
    target: [-0.49, 0.8, 0.28],
    fov: 52,
    zone: "table",
    label: "Праздничный стол",
  },
  right: {
    position: [-0.2, 1.5, 2.45],
    target: [2.03, 0.8, 0.5],
    fov: 52,
    zone: "right",
    label: "Разложенный диван и портреты",
  },
  desk: {
    position: [0.88, 1.48, -1.33],
    target: [2.15, 1.07, -1.6],
    fov: 46,
    zone: "desk",
    label: "Компьютерный уголок",
  },
  tv: {
    position: [-1.05, 1.25, -0.556],
    target: [-2.1, 1.23, -0.556],
    fov: 46,
    zone: "left",
    label: "Телевизор · крупный план",
  },
  radio: {
    position: [-1.1, 1.65, -1.47],
    target: [-2.1, 1.63, -1.47],
    fov: 41,
    zone: "left",
    label: "Радио · настройка",
  },
  picture: {
    position: [0.55, 1.98, 0.52],
    target: [2.55, 1.96, 0.52],
    fov: 46,
    zone: "right",
    label: "Репродукции над диваном",
  },
  sofa: {
    position: [0.55, 1.36, 1.3],
    target: [2.03, 0.52, 0.95],
    fov: 57,
    zone: "right",
    label: "Разложенный диван",
  },
  books: {
    position: [-1.1, 1.12, -1.47],
    target: [-2.1, 1.02, -1.47],
    fov: 42,
    zone: "left",
    label: "Домашняя полка",
  },
  salad: {
    position: [-0.63, 1.48, 0.53],
    target: [-0.66, 0.93, -0.14],
    fov: 43,
    zone: "table",
    label: "Оливье",
  },
  mandarins: {
    position: [-0.2, 1.35, 1.4],
    target: [-0.21, 0.92, 0.78],
    fov: 43,
    zone: "table",
    label: "Мандарины",
  },
  bread: {
    position: [-0.78, 1.31, 1.44],
    target: [-0.74, 0.87, 0.87],
    fov: 43,
    zone: "table",
    label: "Хлеб с сахаром",
  },
  duck: {
    position: [-0.72, 1.29, 0.95],
    target: [-0.73, 0.95, 0.32],
    fov: 40,
    zone: "table",
    label: "Запечённая утка",
  },
  cake: {
    position: [-0.02, 1.34, 1.04],
    target: [-0.27, 0.94, 0.39],
    fov: 42,
    zone: "table",
    label: "Торт «Наполеон»",
  },
  rice: {
    position: [-0.24, 1.27, 0.46],
    target: [-0.22, 0.925, -0.09],
    fov: 40,
    zone: "table",
    label: "Кутья",
  },
  portrait1: {
    position: [1.15, 1.95, -0.11],
    target: [2.57, 1.96, -0.11],
    fov: 44,
    zone: "right",
    label: "Портрет М.И. Лопухиной",
  },
  portrait2: {
    position: [1.15, 1.95, 0.52],
    target: [2.57, 1.96, 0.52],
    fov: 44,
    zone: "right",
    label: "Всадница",
  },
  portrait3: {
    position: [1.15, 1.95, 1.15],
    target: [2.57, 1.96, 1.15],
    fov: 44,
    zone: "right",
    label: "Кружевница",
  },

  drinks: {
    position: [0.32, 1.24, 0.76],
    target: [-0.17, 0.96, 0.16],
    fov: 43,
    zone: "table",
    label: "Праздничный стол · напитки",
  },
};
export function resolveView(view) {
  return Object.hasOwn(CAMERA_VIEWS, view) ? view : "room";
}
export function viewZone(view) {
  return CAMERA_VIEWS[resolveView(view)].zone;
}
export function viewForKey(key, current) {
  return (
    { Escape: "room", 0: "room", 1: "left", 2: "table", 3: "right", 4: "desk" }[
      key
    ] ?? current
  );
}
export function damping(delta) {
  return 1 - Math.exp(-4.5 * Math.max(0, delta));
}
export function needsNavigation(current, destination) {
  return current !== destination;
}
export function isNavigationKey(key) {
  return ["Escape", "0", "1", "2", "3", "4"].includes(key);
}
export function travelProgress(elapsed, duration) {
  const t = Math.max(0, Math.min(1, elapsed / Math.max(0.001, duration)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
