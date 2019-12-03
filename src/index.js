// Tree-shaking imports
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { FlyCamera } from "@babylonjs/core/Cameras/flyCamera";
import { FollowCamera } from '@babylonjs/core/Cameras/followCamera';
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

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
camera.cameraAcceleration = 0.005;

// The speed at which acceleration is halted
camera.maxCameraSpeed = 10;

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// Color Palette
var primaryColor = new Color3(0.338, 0.80, 0.94);
var primaryColorDark = new Color3(0.184, 0.502, 0.929);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
light.diffuse = primaryColor;
light.specular = primaryColor
light.groundColor = primaryColorDark;

// Create a grid material
var material = new GridMaterial("grid", scene);
var primaryMaterial = new StandardMaterial("primaryMaterial", scene);
primaryMaterial.ambientColor = primaryColor;

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

sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.5 }, scene);
ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene);

sphere.physicsImpostor.setLinearVelocity(new Vector3(2, 0, 0));


// Camera focus
camera.lockedTarget = sphere;

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});