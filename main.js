import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ReflectorForSSRPass } from "three/examples/jsm/objects/ReflectorForSSRPass.js";
import {
  FXAAShader,
  OrbitControls,
  RenderPass,
} from "three/examples/jsm/Addons.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import LocomotiveScroll from "locomotive-scroll";
import Particle from "./particle";
import animations, { getReverseAnim } from "./animations";
import showLoader from "./loading";
import onModelLoad from "./utils";

gsap.registerPlugin(ScrollTrigger);
let scene, renderer, camera, stats;
let mixer, clock;
let action, walkAction;
let totalAssetsWeight = 0;
let assetsWeightLoaded = 0;
let currentModel = 0;

var containerGroup = new THREE.Group();
var modelsGroup = new THREE.Group();
var mainGroup = new THREE.Group();
let loading = [0, 0, 0];
const bloomGroup = new THREE.Group();
const particles = [];

const params = {
  enableSSR: true,
  autoRotate: true,
  otherMeshes: true,
  groundReflector: true,
};
let composer;
let ssrPass;
let groundReflector;
const selects = [];

const modelsConfig = [
  {
    index: 1,
    name: "Soldier",
    animationArrayIndex: 3,
    lookAt: [0, 1.7, 0],
    background: "rgb(32, 31, 31)",
    particlesColor: "orange",
    info: [
      {
        title: "Mechaura Makeover",
        description:
          "Switch up your Terraguard's armor with digital upgrades, rank up on the Mechaura Index, and build your bot for the metaverse.",
      },
      {
        title: "Walk the Mechaura Walk",
        description:
          "Take to the Mechaura Walk and showcase your Terraguard's collection.",
      },
    ],
  },
  {
    index: 2,
    name: "light_assault_mech",
    scale: 0.8,
    rotate: Math.PI,
    animationArrayIndex: 0,
    lookAt: [0, 2, 0],
    background: "rgb(107, 252, 255)",
    particlesColor: "gray",
    info: [
      {
        title: "Battle-Ready Upgrades",
        description:
          "Switch up your Aurora Strike's loadout with exclusive digital mods, rank up on the Mechaura Leaderboard, and optimize your mech for battle.",
      },
      {
        title: "Runway Dominance",
        description:
          "Own the Mechaura Runway and display your Aurora Strike's sleek design.",
      },
    ],
  },
  {
    index: 3,
    name: "free_droide_de_seguridad_k-2so_by_oscar_creativo",
    scale: 0.55,
    rotate: Math.PI,
    animationArrayIndex: 0,
    lookAt: [0, 1.5, 0],
    background: "rgb(234, 234, 234)",
    particlesColor: "red",
    info: [
      {
        title: "Security Overhaul",
        description:
          "Switch up your Vigilantius's protocols with cutting-edge digital updates, ascend the Mechaura Security Rankings, and enhance your droid's surveillance capabilities.",
      },
      {
        title: "Sphere of Influence",
        description:
          "Rule the Mechaura Sphere and demonstrate your Vigilantius's advanced security skills.",
      },
    ],
  },
];
const models = [null, null, null];
const mixers = [];

const walkHeaderNumber1 = document.getElementById("id-walk-header-number-1");
const walkHeaderNumber2 = document.getElementById("id-walk-header-number-2");
const walkHeader1 = document.getElementById("id-walk-header-1");
const walkHeader2 = document.getElementById("id-walk-header-2");
const walkDescrition1 = document.getElementById("id-walk-description-1");
const walkDescrition2 = document.getElementById("id-walk-description-2");
const loading1 = document.getElementById("loading-1");
const loading2 = document.getElementById("loading-2");
const loading3 = document.getElementById("loading-3");
const loadingContainer = document.getElementById("loading");

const loaderMesh = showLoader(containerGroup);
loaderMesh.userData.label = "loader";

const afterLoad = (model, modelObj) => {
  // model.visible = false;
  // containerGroup.add(skeleton);
  console.log("here");

  models[model.userData.modelObj.index - 1] = model;
  if (models.every((model) => model !== null)) {
    console.log("mixers", mixers);
    models.forEach((model, i) => {
      mixers.push(new THREE.AnimationMixer(model));
      playModels(model, i);
    });
    containerGroup.children[3].visible = true;
    containerGroup.children[4].visible = false;
    containerGroup.children[5].visible = false;

    walkHeader1.textContent = modelsConfig[currentModel].info[0].title;
    walkDescrition1.textContent =
      modelsConfig[currentModel].info[0].description;
    walkHeader2.textContent = modelsConfig[currentModel].info[1].title;
    walkDescrition2.textContent =
      modelsConfig[currentModel].info[1].description;
    renderer.setAnimationLoop(animate);
  }
};

const playModels = (model, i) => {
  const animations = model.userData.gltf.animations;

  walkAction = mixers[i].clipAction(
    animations[model.userData.modelObj.animationArrayIndex]
  );

  action = walkAction;
  action.play();
  action.timeScale = 2.9 / 5;
  containerGroup.add(model);
};

const loadModel = (modelObj, i) => {
  const loader = new GLTFLoader();
  loader.load(
    modelObj.name + ".glb",
    (gltf) => onModelLoad(gltf, modelObj, afterLoad),
    (xhr) => {
      totalAssetsWeight = xhr;
      loading[i] = xhr.total > 0 ? xhr.loaded / xhr.total : 1;
      console.log("loading", xhr);
      if (i == 0) {
        const per = Math.round(Number(loading[0]) * 100) + "%";
        console.log("loading[0]", per);
        gsap.to(
          loading1,
          // { textContent: Math.round(Number(loading1.textContent)) },
          {
            textContent: per,
            duration: 1,
            ease: "power1.inOut",
          }
        );
        // loading1.textContent = Math.round(loading[0] * 100) + "%";
      }
      if (i == 1) {
        gsap.to(
          loading2,
          // { textContent: Math.round(Number(loading1.textContent)) },
          {
            textContent: Math.round(Number(loading[1]) * 100) + "%",
            duration: 1,
            ease: "power1.inOut",
          }
        );
      }
      if (i == 2) {
        gsap.to(
          loading3,
          // { textContent: Math.round(Number(loading1.textContent)) },
          {
            textContent: Math.round(Number(loading[2]) * 100) + "%",
            duration: 1,
            ease: "power1.inOut",
          }
        );
      }
      if (loading.every((loaded) => loaded == 1)) {
        const tl = gsap.timeline();
        const iconsContainer = document.getElementById("icons-container");
        iconsContainer.style.display = "flex";
        tl.to(loadingContainer, {
          bottom: "100%",
          top: "-100%",
          // opacity: 0,
          duration: 1,
          delay: 1.5,
          ease: "power1.inOut",
        });
        console.log(document.querySelectorAll("#icons-container img"));
        tl.to("#icons-container img", {
          top: 0,
          duration: 1,
          // ease: "back.out(1.7)",
          ease: "elastic.out(0.4,0.3)",
          stagger: 0.2,
        });
      }
      // console.log("xhr", xhr);
      // containerGroup.updateMatrix();
      // console.log(
      //   "((xhr.loaded / xhr.total) * 3.6 * Math.PI) / 180",
      //   xhr.loaded / xhr.total,
      //   xhr.loaded / xhr.total == 1 ? 0.99999 : xhr.loaded / xhr.total
      // );
    }
  );
};
init();
// loadModel(modelsConfig[0]);

function init() {
  const container = document.getElementById("container");

  // ---------------------------------------------Three js scene setup----------------------------------------
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0.1, 1.4, -0.5);
  camera.lookAt(0, 1.7, 0);

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.add(containerGroup);

  scene.background = new THREE.Color("rgb(32, 31, 31)");

  let geometry = new THREE.PlaneGeometry(3, 3);
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
  groundReflector.position.z = -1;
  scene.add(groundReflector);
  containerGroup.add(groundReflector);

  const dirLight = new THREE.DirectionalLight(0xffffff, 10);
  dirLight.position.set(-3, 10, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  containerGroup.add(dirLight);
  // scene.add(dirLight);

  const hemiLight = new THREE.HemisphereLight(0x8d7c7c, 0x494966, 5);
  scene.add(hemiLight);

  // ---------------------------------------------Three js scene setup END----------------------------------------
  // ---------------------------------------------3D Object model init--------------------------------------------
  // let currentModel = 0;
  // loadModel(modelsConfig[0]);
  const reverseAnim = getReverseAnim();
  Array.from(document.querySelectorAll(".character")).map((character, i) => {
    character.onclick = () => {
      if (currentModel === i) return;
      const isOngoing = reverseAnim(camera);
      if (isOngoing) {
        return;
      }
      setTimeout(() => {
        currentModel = i;
        containerGroup.children[3].visible = false;
        containerGroup.children[4].visible = false;
        containerGroup.children[5].visible = false;

        containerGroup.children[3 + currentModel].visible = true;
        scene.background = new THREE.Color(
          modelsConfig[currentModel].background
        );

        walkHeader1.textContent = modelsConfig[currentModel].info[0].title;
        walkDescrition1.textContent =
          modelsConfig[currentModel].info[0].description;
        walkHeader2.textContent = modelsConfig[currentModel].info[1].title;
        walkDescrition2.textContent =
          modelsConfig[currentModel].info[1].description;
        function invert(rgb) {
          rgb = Array.prototype.join.call(arguments).match(/(-?[0-9\.]+)/g);
          for (var i = 0; i < rgb.length; i++) {
            rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
          }
          return rgb;
        }
        const textColor = `rgb(${invert(
          modelsConfig[currentModel].background
        ).join(", ")})`;
        walkHeader1.style.color = textColor;
        walkDescrition1.style.color = textColor;
        walkHeader2.style.color = textColor;
        walkDescrition2.style.color = textColor;
        walkHeaderNumber1.style.color = textColor;
        walkHeaderNumber2.style.color = textColor;
      }, 500);
    };
  });

  // ---------------------------------------------GSAP scroll animation--------------------------------------------
  animations(container, containerGroup, camera, modelsConfig[currentModel]);
  // ---------------------------------------------GSAP scroll animation END----------------------------------------

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    premultipliedAlpha: false,
    alpha: true,
  });
  // renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth - 20, window.innerHeight);
  renderer.shadowMap.enabled = true;
  var parameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
  };
  var renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth - 20,
    window.innerHeight,
    parameters
  );
  composer = new EffectComposer(renderer, renderTarget);
  var renderPass = new RenderPass(scene, camera);
  renderPass.clearColor = new THREE.Color(0, 0, 0);
  renderPass.clearAlpha = 0;

  // composer.addPass(new RenderPass(scene, camera));
  composer.addPass(renderPass);
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

  ssrPass.maxDistance = 0.5;
  groundReflector.maxDistance = ssrPass.maxDistance;
  ssrPass.opacity = 1;
  groundReflector.opacity = ssrPass.opacity;

  container.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);
  // window.addEventListener("mousemove", onMouseMove);
  modelsConfig.forEach((modelConfig, i) => loadModel(modelConfig, i));
}
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("mousedown", () => {
  document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 33'%3E%3Cpath fill='%23fff' d='M24.68 17.76a24.94 24.94 0 0 1-2.46 7.95c-.26.54-.45 1.1-.68 1.63-.65 1.3-.48 3.02-.5 3.13l-.8.04-1.71-3.97c-.53.86-1.04 1.96-1.53 2.8l-.91-.06s-1.04-2.85-1.6-4.25c-.34 1.06-.64 2.03-.93 3-.22.7-.46 1.9-.67 2.6h-.87c0-1.75-.14-1.83-.56-2.29-.96-1.05-1.91-2.11-2.92-3.12-.71-.7-1.36-1.42-1.22-2.51.13-1.03.32-2.06.57-3.08.2-.78.86-1.18 1.6-1.53.55 1.38 1.07 2.76 2.02 4l-.14-.7-.42-2.13a39.23 39.23 0 0 0-1.12-3.38C8.7 12.62 7.06 7.3 7.23 4.6c.04-.72.38-1.4.86-1.72a.96.96 0 0 1 .88-.13c.23.13.5 1.16.64 1.8.12.45.23.92.38 1.38.77 2.4 1.8 4.72 3.09 6.9l.06.1a5.13 5.13 0 0 0 1.92 1.65c.23.08.47.15.72.2 0 0-.3-.39-.76-1.1.3-.9.94-1.38 1.77-1.33.86.03 1.38.5 1.52 1.36l.09.63c.51-1.16.9-1.4 2.02-1.24.89.12 1.35.66 1.49 1.67.24-.2.5-.49.8-.6.85-.33 1.65.13 1.91 1.03.26.85.17 1.7.06 2.55Z'/%3E%3Cpath fill='%23000' d='M25.99 15.21c-.26-2.16-2.1-2.98-3.52-2.36-1.08-1.82-2.83-1.36-3.68-1.13l-.08.02-.07-.02c-1.03-1.13-2.73-.74-2.83-.65 0 0-.87.2-1.67 1.04-1.15-2.1-2.1-4.3-2.82-6.57-.14-.42-.25-.87-.36-1.3v-.05c-.33-1.28-.6-2.38-1.5-2.69a2.29 2.29 0 0 0-2.05.29 3.59 3.59 0 0 0-1.46 2.74c-.2 3.44 2.07 9.71 3.1 12.36l-.13.08c-1.04.53-1.94 1.23-2.26 2.43-.13.5-.22 1-.3 1.5l-.07.44c-.1.58-.2 1.15-.2 1.73-.02 1.2.61 2.1 1.43 2.91.75.74 1.47 1.52 2.2 2.29l.71.77c.26.26.38.64.36 1-.02.45-.02.89-.01 1.33v.67h3a1337.73 1337.73 0 0 1 .85-3l1.09 1.58 1.67.07 1.02-1.32a119.12 119.12 0 0 1 .95 2.16c.05.12.18.28.27.28h2.74v-.45a28.9 28.9 0 0 1 .01-1.3c0-.45 0-.9.1-1.32.2-.75.48-1.48.81-2.18 1.14-2.48 2.2-4.98 2.58-7.73.16-1.2.27-2.38.12-3.62Zm-1.25 2.55a24.94 24.94 0 0 1-2.47 7.95c-.18.37-.32.74-.47 1.12l-.2.51c-.58 1.14-.52 2.6-.5 3.02v.11l-.81.04-.77-1.78-.94-2.2c-.3.5-.59 1.05-.87 1.6-.23.42-.44.84-.66 1.2l-.9-.05s-1.05-2.85-1.6-4.25l-.94 3c-.11.37-.23.87-.35 1.37-.11.45-.22.9-.32 1.24h-.86c0-1.7-.13-1.83-.52-2.25l-.05-.05-.21-.23c-.88-.98-1.77-1.96-2.7-2.89-.72-.7-1.37-1.42-1.23-2.51.14-1.03.32-2.06.57-3.08.2-.78.87-1.18 1.6-1.53l.06.15a14.72 14.72 0 0 0 1.96 3.84c-.04-.23-.08-.46-.14-.69l-.41-2.13c-.16-.81-1.13-3.38-1.13-3.38C8.75 12.62 7.11 7.3 7.28 4.6c.04-.72.39-1.4.86-1.72a.96.96 0 0 1 .89-.13c.12.07.25.4.37.8l-1.4.4c.12.51.49 1.23.49 1.23l.07-.02v.02l1.17-.34c.08.37.18.73.3 1.1.76 2.4 1.8 4.72 3.09 6.9l.06.1c.6.96 1.7 1.56 1.7 1.56l.22.08c.24.1.48.16.72.22 0-.01-.3-.4-.76-1.12.3-.9.94-1.37 1.77-1.32.86.03 1.38.5 1.52 1.36a23.63 23.63 0 0 0 .08.63c.52-1.16.9-1.4 2.03-1.24.88.12 1.35.66 1.48 1.67.07-.06.15-.12.22-.2.18-.15.37-.32.59-.4.84-.33 1.64.13 1.9 1.03.28.84.2 1.69.09 2.54Zm-10.23-.2c2.92.14 5.77.72 8.64 1.5l.34-1.3a39.65 39.65 0 0 0-8.98-1.54v1.34Zm7.94 3.7s-5.65-1.09-6.23-1.18l.15-1.2.02-.21 6.47 1.35c-.11.42-.25.83-.4 1.24Z'/%3E%3C/svg%3E%0A") 12 2,auto`;
});
window.addEventListener("mouseup", () => {
  document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32'%3E%3Cpath fill='%23fff' d='M24.7 17.8a25.1 25.1 0 0 1-2.49 8.02c-.25.53-.45 1.1-.67 1.64-.66 1.3-.5 3.03-.5 3.15l-.82.04-1.72-4c-.53.87-1.05 1.97-1.54 2.82l-.91-.07s-1.05-2.87-1.61-4.28c-.34 1.08-.65 2.05-.94 3.02-.22.72-.46 1.91-.68 2.64h-.87c0-1.78-.14-1.86-.57-2.32-.96-1.06-1.92-2.13-2.93-3.14-.73-.71-1.37-1.43-1.23-2.53.13-1.04.32-2.07.57-3.1.2-.79.88-1.19 1.62-1.53.54 1.38 1.06 2.77 2.03 4-.22-1.06-.43-2.06-.6-3.05-.7-3.83-.57-7.65.21-11.44.35-1.66.78-3.3 1.2-4.95.3-1.16 1.14-1.68 2.22-1.44.97.22 1.4.97 1.22 1.96-.4 2.1-.81 4.18-1.15 6.28-.3 1.85-.18 3.7.18 5.52.07-.4.1-.8.21-1.17.29-1 .95-1.53 1.83-1.49.86.04 1.39.5 1.53 1.37l.08.63c.51-1.16.9-1.4 2.04-1.24.89.12 1.36.66 1.5 1.68.24-.2.49-.5.8-.6.86-.34 1.66.13 1.92 1.03.26.85.17 1.7.07 2.56Z'/%3E%3Cpath fill='%23000' d='M22.38 12.84c1.42-.62 3.25.2 3.52 2.36a13.4 13.4 0 0 1-.14 3.62c-.37 2.74-1.43 5.24-2.56 7.72-.34.7-.6 1.42-.8 2.17-.11.42-.11.86-.1 1.3l-.01.49v1.28h-2.75c-.09 0-.2-.17-.26-.28l-.58-1.31-.38-.85-1.01 1.32-1.67-.07-1.07-1.57-.85 2.98h-3V30.01c.03-.37-.09-.74-.35-1l-.71-.77a78.89 78.89 0 0 0-2.19-2.28c-.82-.82-1.46-1.72-1.44-2.9 0-.55.1-1.09.19-1.62l.09-.55c.07-.5.16-1 .29-1.5.32-1.2 1.22-1.9 2.26-2.43.32-.16.38-.35.38-.71v-.52c-.02-1.58-.04-3.16.08-4.72.19-2.67.82-5.26 1.53-7.83.2-.7.49-1.37.85-2 .5-.9 2.06-1.53 3.5-.97a2.8 2.8 0 0 1 1.78 3.32c-.4 2.04-.76 4.08-1.13 6.13a8 8 0 0 0-.1 1c0 .13 0 .27-.02.4.1-.09 1.8-.48 2.82.65l.07.02.09-.02c.85-.23 2.59-.69 3.67 1.13Zm-.2 12.84a24.9 24.9 0 0 0 2.46-7.94c.1-.85.2-1.7-.06-2.53-.26-.9-1.06-1.36-1.9-1.04-.22.09-.41.25-.59.42l-.22.19c-.13-1.01-.6-1.55-1.48-1.67-1.12-.16-1.5.08-2.02 1.23l-.02-.16a6.67 6.67 0 0 0-.06-.46c-.14-.86-.66-1.33-1.52-1.36-.87-.05-1.52.47-1.8 1.47-.08.25-.12.51-.16.78l-.06.39a15.2 15.2 0 0 1-.18-5.48c.34-2.08.74-4.15 1.14-6.23.19-.97-.24-1.72-1.2-1.94-1.07-.24-1.9.28-2.2 1.42-.43 1.64-.85 3.27-1.2 4.92-.77 3.76-.9 7.54-.22 11.34l.42 2.13.18.9c-.92-1.18-1.43-2.5-1.95-3.83l-.06-.15c-.73.35-1.4.75-1.6 1.53a28.03 28.03 0 0 0-.57 3.07c-.14 1.09.5 1.8 1.22 2.5.93.94 1.82 1.92 2.7 2.9l.21.22.05.06c.39.41.52.55.52 2.24h.86c.1-.34.2-.79.32-1.24.12-.5.24-1 .35-1.38l.93-2.99c.55 1.4 1.6 4.25 1.6 4.25l.9.06c.22-.37.44-.78.66-1.2.28-.55.57-1.11.87-1.6l.94 2.2.76 1.77.82-.04v-.11c-.02-.42-.08-1.88.49-3.01l.2-.52c.15-.37.3-.75.47-1.1ZM13.22 2.33l2.02.43-.4 1.28-1.69-.35v-.02l-.07-.01s0-.8.14-1.33Zm1.21 15.2c2.92.15 5.77.73 8.63 1.5l.34-1.28a39.58 39.58 0 0 0-8.97-1.55v1.34Zm7.95 3.7s-5.65-1.08-6.23-1.17l.05-.37.12-1.03L22.78 20c-.11.41-.25.83-.4 1.23Z'/%3E%3C/svg%3E%0A") 12 2,auto`;
});

const randomSparkles = () => {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(bloomGroup));
    containerGroup.add(bloomGroup);
  }
  // scene.add(containerGroup);
};

randomSparkles();

let oldCurrentModel;
function animate() {
  // if (loading.every((loaded) => loaded !== 1)) {
  //   canvasContainer;
  // }
  for (let i = 0; i < particles.length; i++) {
    const element = particles[i];
    element.update(
      oldCurrentModel !== currentModel
        ? modelsConfig[currentModel].particlesColor
        : null
    );
  }

  let mixerUpdateDelta = clock.getDelta();
  // console.log("mixer", mixer);
  mixers.forEach((mixer) => {
    mixer.update(mixerUpdateDelta);
  });

  renderer.render(scene, camera);
  composer.render();
  // controls.update();
  oldCurrentModel = currentModel;
}

// let myAudio = document.querySelector("#audio");
// window.addEventListener("click", () => {
//   myAudio.currentTime = 25;
//   // myAudio.play();
// });
