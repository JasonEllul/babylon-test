// Tree-shaking imports
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Axis, Space, Vector3 } from "@babylonjs/core/Maths/math";

import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { FlyCamera } from "@babylonjs/core/Cameras/flyCamera";
import { FollowCamera } from '@babylonjs/core/Cameras/followCamera';
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { ExecuteCodeAction } from "@babylonjs/core/Actions/directActions";

import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import { Color3 } from "@babylonjs/core/Maths/math";

import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GridMaterial } from "@babylonjs/materials/grid";

import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins/cannonJSPlugin';
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";

import * as CANNON from 'cannon';

// Random Raw Imports?
import "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/core/Physics/physicsEngineComponent";
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import '@babylonjs/core/Maths/math';

import 'babylonjs-loaders';

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas");

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
var scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new FollowCamera("camera1", new Vector3(20, 15, 20), scene);

// This targets the camera to scene origin
// The goal distance of camera from target
camera.radius = 30;

// The goal height of camera above local origin (centre) of target
camera.heightOffset = 15;

// The goal rotation of camera around local origin (centre) of target in x y plane
camera.rotationOffset = 45;

// Acceleration of camera in moving from current to goal position
camera.cameraAcceleration = 0.025;

// The speed at which acceleration is halted
camera.maxCameraSpeed = 10;

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// Create dummy object for camera to follow
var followObject = Mesh.CreateBox("followObject", 0.001, scene);
// Camera focus on follow object
camera.lockedTarget = followObject;

// Color Palette
var primaryColor = new Color3(0.338, 0.80, 0.94);
var primaryColorDark = new Color3(0.184, 0.502, 0.929);
var secondaryColor = new Color3(0.976, 0.325, 0.776);

// Material Palette
var material = new GridMaterial("grid", scene);

var primaryMaterial = new StandardMaterial("primaryMaterial", scene);
primaryMaterial.ambientColor = primaryColor;
var secondaryMaterial = new StandardMaterial("secondaryMaterial", scene);
secondaryMaterial.ambientColor = secondaryColor;

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
light.diffuse = primaryColor;
light.specular = primaryColor
light.groundColor = primaryColorDark;

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 4;

// Affect a material
sphere.material = primaryMaterial;

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = Mesh.CreateGround("ground1", 1000, 1000, 2, scene);

// Affect a material
ground.material = material;


// Enable Physics
var gravityVector = new Vector3(0, -9.81, 0);
var physicsPlugin = new CannonJSPlugin(true, 10, CANNON);
scene.enablePhysics(gravityVector, physicsPlugin);

sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 5, restitution: 0.9 }, scene);
sphere.physicsImpostor.physicsBody.linearDamping = 0.1;
ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5, friction: 0.5 }, scene);

// Register control listeners
var map = {};
scene.actionManager = new ActionManager(scene);

scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
  map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));

scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
  map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));

// var newMeshes = (SceneLoader.ImportMesh("", "../assets/", "spaceship.glb", scene)).meshes;

var box = Mesh.CreateBox('box1', 2, scene);
box.position.y = 1;
box.position.x = -50;
box.position.z = -50;
box.material = secondaryMaterial;
box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9, friction: 0.5 }, scene);
var box2 = Mesh.CreateBox('box2', 2, scene);
box2.position.y = 1;
box2.position.x = -48;
box2.position.z = -50;
box2.material = secondaryMaterial;
box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9, friction: 0.5 }, scene);
var box3 = Mesh.CreateBox('box3', 2, scene);
box3.position.y = 1;
box3.position.x = -52;
box3.position.z = -50;
box3.material = secondaryMaterial;
box3.physicsImpostor = new PhysicsImpostor(box3, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9, friction: 0.5 }, scene);
var box3 = Mesh.CreateBox('box3', 2, scene);
box3.position.y = 3;
box3.position.x = -50;
box3.position.z = -50;
box3.material = secondaryMaterial;
box3.physicsImpostor = new PhysicsImpostor(box3, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9, friction: 0.5 }, scene);

var ramp = Mesh.CreateBox('ramp', 30, scene);
ramp.position.y = -10;
ramp.position.x = -20;
ramp.position.z = -20;
ramp.material = material;
ramp.physicsImpostor = new PhysicsImpostor(ramp, PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
ramp.rotate(Axis.X, 60, Space.LOCAL);
ramp.rotate(Axis.Y, 60, Space.LOCAL);

scene.registerAfterRender(function () {

  let playerPosition = sphere.getAbsolutePosition();
  // Update follow object
  followObject.position = playerPosition;

  // Apply forces based on controls
  var dtime = scene.getEngine().getDeltaTime()
  if ((map["w"] || map["W"])) {
    var force = new Vector3(-1, 0, -1);
    sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
  };
  if ((map["s"] || map["S"])) {
    var force = new Vector3(1, 0, 1);
    sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
  };

  if ((map["a"] || map["A"])) {
    var force = new Vector3(1, 0, -1);
    sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
  };

  if ((map["d"] || map["D"])) {
    var force = new Vector3(-1, 0, 1);
    sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
  };

});

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});


