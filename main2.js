import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { SSRPass } from "three/addons/postprocessing/SSRPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ReflectorForSSRPass } from "three/addons/objects/ReflectorForSSRPass.js";

const params = {
  enableSSR: true,
  autoRotate: true,
  otherMeshes: true,
  groundReflector: true,
};
let composer;
let ssrPass;
let controls;
let camera, scene, renderer;
const otherMeshes = [];
let groundReflector;
const selects = [];

const container = document.querySelector("#container");

// Configure and create Draco decoder.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("jsm/libs/draco/");
dracoLoader.setDecoderConfig({ type: "js" });

init();

function init() {
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    15
  );
  camera.position.set(
    0.13271600513224902,
    0.3489546826045913,
    0.43921296427927076
  );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x443333);
  scene.fog = new THREE.Fog(0x443333, 1, 4);

  // Lights
  const hemiLight = new THREE.HemisphereLight(0x8d7c7c, 0x494966, 3);
  scene.add(hemiLight);

  let geometry, material, mesh;

  geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  material = new THREE.MeshStandardMaterial({ color: "green" });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(-0.12, 0.025, 0.015);
  scene.add(mesh);
  otherMeshes.push(mesh);
  selects.push(mesh);

  geometry = new THREE.PlaneGeometry(1, 1);
  groundReflector = new ReflectorForSSRPass(geometry, {
    clipBias: 0.0003,
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0x888888,
    useDepthTexture: true,
  });
  groundReflector.material.depthWrite = false;
  groundReflector.rotation.x = -Math.PI / 2;
  groundReflector.visible = false;
  scene.add(groundReflector);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  // composer

  composer = new EffectComposer(renderer);
  ssrPass = new SSRPass({
    renderer,
    scene,
    camera,
    width: innerWidth,
    height: innerHeight,
    groundReflector: params.groundReflector ? groundReflector : null,
    selects: params.groundReflector ? selects : null,
  });

  composer.addPass(ssrPass);
  composer.addPass(new OutputPass());

  ssrPass.thickness = 0.018;
  ssrPass.infiniteThick = false;

  ssrPass.maxDistance = 0.1;
  groundReflector.maxDistance = ssrPass.maxDistance;
  ssrPass.opacity = 1;
  groundReflector.opacity = ssrPass.opacity;
  // folder.open()
  // gui.close()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  groundReflector
    .getRenderTarget()
    .setSize(window.innerWidth, window.innerHeight);
  groundReflector.resolution.set(window.innerWidth, window.innerHeight);
}

function animate() {
  render();
}

function render() {
  if (params.autoRotate) {
    // const timer = Date.now() * 0.0003;

    // camera.position.x = Math.sin(timer) * 0.5;
    // camera.position.y = 0.2135;
    // camera.position.z = Math.cos(timer) * 0.5;
    camera.lookAt(0, 0.0635, 0);
  } else {
    controls.update();
  }

  if (params.enableSSR) {
    // TODO: groundReflector has full ground info, need use it to solve reflection gaps problem on objects when camera near ground.
    // TODO: the normal and depth info where groundReflector reflected need to be changed.
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}
