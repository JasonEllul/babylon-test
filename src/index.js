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
import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin';
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";

import * as CANNON from 'cannon';

import * as Ammo from 'ammo.js';

// Random Raw Imports?
import "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/core/Physics/physicsEngineComponent";
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import '@babylonjs/core/Maths/math';

import '@babylonjs/loaders';
import "@babylonjs/loaders/glTF";
// Add loading screen
import '@babylonjs/core/Loading/loadingScreen';

// Global Variables

let canvas = document.getElementById("renderCanvas");

let engine = new Engine(canvas);

var sphere, camera, followMesh;

// Mapping of current keys the user is pressing
var keyEvents = {};

var createScene = async () => {
  // Create our first scene.
  var scene = new Scene(engine);

  // This creates and positions a free camera (non-mesh)
  camera = new FollowCamera("camera1", new Vector3(20, 15, 20), scene);

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
  followMesh = Mesh.CreateBox("followMesh", 0.001, scene);
  // Camera focus on follow object
  //camera.lockedTarget = followMesh;

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
  sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

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
  // var physicsPlugin = new CannonJSPlugin(true, 10, CANNON);
  var physicsPlugin = new AmmoJSPlugin(true, Ammo);
  scene.enablePhysics(gravityVector, physicsPlugin);

  sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 5, restitution: 0.9 }, scene);
  sphere.physicsImpostor.physicsBody.linearDamping = 0.1;
  ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5, friction: 0.5 }, scene);

  // Register control listeners
  scene.actionManager = new ActionManager(scene);

  scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
    keyEvents[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));

  scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
    keyEvents[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));

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

  // Load spaceship
  var spaceshipMeshes = (await SceneLoader.ImportMeshAsync("", "../assets/", "spaceship.glb", scene)).meshes;
  console.log(spaceshipMeshes)

  var spaceship = makePhysicsObject(spaceshipMeshes, scene, 0.2)
  spaceship.position.y += 30;
  console.log(spaceship);

  camera.lockedTarget = spaceship;

  return scene;
}

createScene().then(scene => {
  // Run every frame
  scene.registerAfterRender(function () {
    let playerPosition = sphere.getAbsolutePosition();
    // Update follow object
    followMesh.position = playerPosition;

    // Apply forces based on controls
    var dtime = scene.getEngine().getDeltaTime()
    if ((keyEvents["w"] || keyEvents["W"])) {
      var force = new Vector3(-1, 0, -1);
      sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
    };
    if ((keyEvents["s"] || keyEvents["S"])) {
      var force = new Vector3(1, 0, 1);
      sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
    };

    if ((keyEvents["a"] || keyEvents["A"])) {
      var force = new Vector3(1, 0, -1);
      sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
    };

    if ((keyEvents["d"] || keyEvents["D"])) {
      var force = new Vector3(-1, 0, 1);
      sphere.physicsImpostor.applyForce(force.scale(dtime), playerPosition);
    };
  });

  // Run Render Loop
  engine.runRenderLoop(() => {
    scene.render();
  });
});

// Convert an array of meshes into a physics object
var makePhysicsObject = (newMeshes, scene, scaling) => {
  // Create physics root and position it to be the center of mass for the imported mesh
  var physicsRoot = new Mesh("physicsRoot", scene);
  physicsRoot.position.y -= 0.9;

  // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
  newMeshes.forEach((m, i) => {
    if (m.name.indexOf("box") != -1) {
      m.isVisible = false
      physicsRoot.addChild(m)
    }
  })

  // Add all root nodes within the loaded gltf to the physics root
  newMeshes.forEach((m, i) => {
    if (m.parent == null) {
      physicsRoot.addChild(m)
    }
  })

  // Make every collider into a physics impostor
  physicsRoot.getChildMeshes().forEach((m) => {
    if (m.name.indexOf("box") != -1) {
      m.scaling.x = Math.abs(m.scaling.x)
      m.scaling.y = Math.abs(m.scaling.y)
      m.scaling.z = Math.abs(m.scaling.z)
      m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);
    }
  })

  // Scale the root object and turn it into a physics impsotor
  physicsRoot.scaling.scaleInPlace(scaling)
  physicsRoot.physicsImpostor = new PhysicsImpostor(physicsRoot, PhysicsImpostor.NoImpostor, { mass: 3 }, scene);

  return physicsRoot
}


