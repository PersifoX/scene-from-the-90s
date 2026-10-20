"""Blender background conversion of Freepoly.org's CC0 Old Computer 02.

Run with Blender --background --disable-autoexec --python this-file.py.
Never executes scripts embedded in the downloaded .blend file.
"""
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/source/vintage-computer/original.blend'
OUTPUT = ROOT / 'public/models/vintage_computer/model.glb'
bpy.ops.wm.open_mainfile(filepath=str(SOURCE), load_ui=False, use_scripts=False)
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
# Bake the source hierarchy before removing its authoring empties.
for obj in meshes:
    world = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = world
for obj in list(bpy.data.objects):
    if obj.type != 'MESH':
        bpy.data.objects.remove(obj, do_unlink=True)

points = [o.matrix_world @ v.co for o in meshes for v in o.data.vertices]
lo = Vector(tuple(min(v[i] for v in points) for i in range(3)))
hi = Vector(tuple(max(v[i] for v in points) for i in range(3)))
center = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
print('SOURCE BOUNDS', list(lo), list(hi), 'SIZE', list(hi-lo))
for obj in meshes:
    obj.location -= center
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    # Retain UVs/material boundaries while reducing the imported dense geometry.
    mod = obj.modifiers.new('Web geometry budget', 'DECIMATE')
    mod.ratio = 0.4
    mod.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.name = 'VintageComputer'
    print('OUTPUT POLYGONS', len(obj.data.polygons))
    obj.select_set(False)

# Rebuild standard glTF PBR links explicitly; the source uses custom node groups.
for mat in bpy.data.materials:
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
    images = [n for n in nodes if n.type == 'TEX_IMAGE']
    color = next(n for n in images if 'baseColor' in n.image.name)
    packed = next(n for n in images if 'metallicRoughness' in n.image.name)
    normal = next(n for n in images if 'normal' in n.image.name)
    separate = nodes.new('ShaderNodeSeparateColor')
    links.new(color.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(packed.outputs['Color'], separate.inputs['Color'])
    links.new(separate.outputs['Green'], bsdf.inputs['Roughness'])
    links.new(separate.outputs['Blue'], bsdf.inputs['Metallic'])
    normal_map = nodes.new('ShaderNodeNormalMap')
    normal_map.inputs['Strength'].default_value = 0.35
    links.new(normal.outputs['Color'], normal_map.inputs['Color'])
    links.new(normal_map.outputs['Normal'], bsdf.inputs['Normal'])
    bsdf.inputs['Coat Weight'].default_value = 0

bpy.ops.object.select_all(action='SELECT')
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(OUTPUT), export_format='GLB',
    use_selection=True, export_yup=True, export_animations=False,
    export_cameras=False, export_lights=False, export_image_format='JPEG',
    export_jpeg_quality=90, export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=14)
print('SAVED', OUTPUT, OUTPUT.stat().st_size)
