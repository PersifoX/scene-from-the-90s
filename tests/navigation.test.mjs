import test from "node:test";
import assert from "node:assert/strict";
const nav =
  await import("../src/features/camera-navigation/model/navigation.mjs");
test("unknown destinations safely return to the whole room", () => {
  assert.equal(nav.resolveView("missing"), "room");
});
test("Escape returns from every detail view", () => {
  for (const view of ["left", "table", "right", "desk"])
    assert.equal(nav.viewForKey("Escape", view), "room");
});
test("zone shortcuts work and unrelated keys preserve view", () => {
  assert.equal(nav.viewForKey("1", "room"), "left");
  assert.equal(nav.viewForKey("2", "room"), "table");
  assert.equal(nav.viewForKey("3", "room"), "right");
  assert.equal(nav.viewForKey("x", "table"), "table");
});
test("camera damping is consistent across frame rates", () => {
  const a = nav.damping(1 / 30);
  const b = nav.damping(1 / 60);
  assert.ok(Math.abs(1 - a - (1 - b) ** 2) < 1e-10);
  assert.equal(nav.damping(0), 0);
});
test("clicking a different zone always navigates before interacting", () => {
  assert.equal(nav.needsNavigation("left", "table"), true);
  assert.equal(nav.needsNavigation("room", "left"), true);
  assert.equal(nav.needsNavigation("table", "table"), false);
});
test("only recognized navigation keys reset the active view", () => {
  assert.equal(nav.isNavigationKey("1"), true);
  assert.equal(nav.isNavigationKey("Escape"), true);
  assert.equal(nav.isNavigationKey("ArrowLeft"), false);
});
test("object close-ups use a longer lens and have distinct destinations", () => {
  for (const shot of ["tv", "radio", "picture", "salad", "mandarins"]) {
    assert.ok(nav.CAMERA_VIEWS[shot].fov < nav.CAMERA_VIEWS.room.fov);
    assert.equal(nav.CAMERA_VIEWS[shot].position.length, 3);
  }
  assert.notDeepEqual(
    nav.CAMERA_VIEWS.tv.position,
    nav.CAMERA_VIEWS.left.position,
  );
});
test("camera travel starts and ends exactly, with stationary endpoints", () => {
  assert.equal(nav.travelProgress(-1, 1), 0);
  assert.equal(nav.travelProgress(0, 1), 0);
  assert.equal(nav.travelProgress(1, 1), 1);
  assert.equal(nav.travelProgress(10, 1), 1);
  assert.ok(nav.travelProgress(0.01, 1) < 0.001);
  assert.ok(nav.travelProgress(0.99, 1) > 0.999);
});
test("object views retain their navigation zone", () => {
  assert.equal(nav.viewZone("tv"), "left");
  assert.equal(nav.viewZone("radio"), "left");
  assert.equal(nav.viewZone("picture"), "right");
  assert.equal(nav.viewZone("salad"), "table");
});
test("holiday dishes have reachable close-ups and retired dishes are removed", () => {
  for (const view of ["duck", "cake"]) {
    assert.equal(nav.resolveView(view), view);
    assert.equal(nav.viewZone(view), "table");
    assert.ok(nav.CAMERA_VIEWS[view].target.every(Number.isFinite));
  }
  assert.equal(nav.resolveView("herring"), "room");
  assert.equal(nav.resolveView("aspic"), "room");
});
