import fs from "node:fs";
import { Box3, Matrix3, Matrix4, Vector3 } from "three";

// Adapt desyn 3D's downloaded mesh and UVs for serving on a platter.
const source = fs.readFileSync("assets/source/roast-duck/original.glb");
const jsonLength = source.readUInt32LE(12);
const original = JSON.parse(source.subarray(20, 20 + jsonLength));
const sourceBin = source.subarray(28 + jsonLength);
const model = {
  asset: {
    version: "2.0",
    copyright: "Chinese Roast Duck — desyn 3D / 3D Warehouse",
    extras: {
      source:
        "https://3dwarehouse.sketchup.com/model/48ed32e9-3757-4c36-a831-8c50b56b8f71/Chinese-Roast-Duck",
      license: "https://3dwarehouse.sketchup.com/tou#license",
      use: "Part of the combined interactive room; not a standalone asset.",
      changes:
        "Hook, head/neck and guide edges omitted; transforms baked, unused vertices removed, PBR adjusted.",
    },
  },
  scene: 0,
  scenes: [{ nodes: [] }],
  nodes: [],
  meshes: [],
  accessors: [],
  bufferViews: [],
  materials: structuredClone(original.materials),
  textures: original.textures,
  samplers: original.samplers,
  images: [],
  buffers: [{ byteLength: 0 }],
};
const chunks = [];
let byteLength = 0;
function append(bytes, target) {
  const padding = Buffer.alloc((4 - (byteLength % 4)) % 4);
  chunks.push(padding, bytes);
  byteLength += padding.length;
  const view = { buffer: 0, byteOffset: byteLength, byteLength: bytes.length };
  if (target) view.target = target;
  byteLength += bytes.length;
  return model.bufferViews.push(view) - 1;
}
for (const image of original.images) {
  const view = original.bufferViews[image.bufferView];
  const bytes = sourceBin.subarray(
    view.byteOffset ?? 0,
    (view.byteOffset ?? 0) + view.byteLength,
  );
  model.images.push({ ...image, bufferView: append(bytes) });
}
const types = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array };
const widths = { SCALAR: 1, VEC2: 2, VEC3: 3 };
function read(accessorId, index, component = 0) {
  const accessor = original.accessors[accessorId];
  const view = original.bufferViews[accessor.bufferView];
  const Type = types[accessor.componentType];
  const stride =
    view.byteStride ?? Type.BYTES_PER_ELEMENT * widths[accessor.type];
  const offset =
    (view.byteOffset ?? 0) +
    (accessor.byteOffset ?? 0) +
    index * stride +
    component * Type.BYTES_PER_ELEMENT;
  return new Type(sourceBin.buffer, sourceBin.byteOffset + offset, 1)[0];
}
function attribute(values, componentType, type, bounds) {
  const accessor = {
    bufferView: append(
      Buffer.from(values.buffer),
      type === "SCALAR" ? 34963 : 34962,
    ),
    componentType,
    type,
    count: values.length / widths[type],
  };
  if (bounds) {
    accessor.min = bounds.min.toArray();
    accessor.max = bounds.max.toArray();
  }
  return model.accessors.push(accessor) - 1;
}
function walk(index, parent) {
  const node = original.nodes[index];
  const world = parent
    .clone()
    .multiply(
      node.matrix ? new Matrix4().fromArray(node.matrix) : new Matrix4(),
    );
  if ([6, 7, 8, 9, 11].includes(node.mesh)) {
    const primitives = [];
    const normalMatrix = new Matrix3().getNormalMatrix(world);
    for (const primitive of original.meshes[node.mesh].primitives) {
      const oldIndices = Array.from(
        { length: original.accessors[primitive.indices].count },
        (_, i) => read(primitive.indices, i),
      );
      const vertices = [...new Set(oldIndices)];
      const lookup = new Map(vertices.map((v, i) => [v, i]));
      const attributes = {};
      for (const [name, id] of Object.entries(primitive.attributes)) {
        const type = original.accessors[id].type;
        const values = new Float32Array(vertices.length * widths[type]);
        const bounds = new Box3();
        vertices.forEach((v, i) => {
          const components = Array.from({ length: widths[type] }, (_, k) =>
            read(id, v, k),
          );
          if (name === "POSITION" || name === "NORMAL") {
            const point = new Vector3(...components);
            if (name === "POSITION") {
              point.applyMatrix4(world);
              bounds.expandByPoint(point);
            } else point.applyMatrix3(normalMatrix).normalize();
            values.set(point.toArray(), i * 3);
          } else values.set(components, i * widths[type]);
        });
        attributes[name] = attribute(
          values,
          5126,
          type,
          name === "POSITION" ? bounds : undefined,
        );
      }
      const indices = new Uint16Array(oldIndices.map((v) => lookup.get(v)));
      if (world.determinant() < 0)
        for (let i = 0; i < indices.length; i += 3)
          [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
      primitives.push({
        attributes,
        indices: attribute(indices, 5123, "SCALAR"),
        material: primitive.material,
      });
    }
    model.scenes[0].nodes.push(
      model.nodes.push({
        name: `Roast duck section ${index}`,
        mesh: model.meshes.push({ primitives }) - 1,
      }) - 1,
    );
  }
  for (const child of node.children ?? []) walk(child, world);
}
const servingRotation = new Matrix4()
  .makeRotationY(Math.PI)
  .multiply(new Matrix4().makeRotationX(Math.PI / 2));
for (const root of original.scenes[original.scene ?? 0].nodes)
  walk(root, servingRotation);
for (const material of model.materials) {
  if (!material.name?.startsWith("Duck")) continue;
  Object.assign(material.pbrMetallicRoughness, {
    metallicFactor: 0,
    roughnessFactor: 0.52,
    baseColorFactor: [1, 1, 1, 1],
  });
}
model.buffers[0].byteLength = byteLength;
const bin = Buffer.concat([
  ...chunks,
  Buffer.alloc((4 - (byteLength % 4)) % 4),
]);
const json = Buffer.from(JSON.stringify(model));
const padding = Buffer.alloc((4 - (json.length % 4)) % 4, 0x20);
const header = Buffer.alloc(20),
  binHeader = Buffer.alloc(8);
header.write("glTF");
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + json.length + padding.length + bin.length, 8);
header.writeUInt32LE(json.length + padding.length, 12);
header.write("JSON", 16);
binHeader.writeUInt32LE(bin.length);
binHeader.write("BIN\0", 4);
const result = Buffer.concat([header, json, padding, binHeader, bin]);
fs.writeFileSync("public/models/roast_duck/model.glb", result);
console.log(`Prepared roast duck: ${result.length.toLocaleString()} bytes`);
