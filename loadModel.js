import { GLTFLoader } from "three/examples/jsm/Addons.js";
import onModelLoad from "./utils";
import { afterLoad } from "./main";
import gsap from "gsap";

const loadModel = (modelObj, i, loading) => {
  const loading1 = document.getElementById("loading-1");
  const loading2 = document.getElementById("loading-2");
  const loading3 = document.getElementById("loading-3");
  const loader = new GLTFLoader();

  loader.load(
    modelObj.name + ".glb",
    (gltf) => onModelLoad(gltf, modelObj, afterLoad),
    (xhr) => {
      // totalAssetsWeight = xhr;
      loading[i] = xhr.total > 0 ? xhr.loaded / xhr.total : 1;
      let per = Math.round(Number(loading[0]) * 100) + "%";

      if (i == 0) {
        // loadThrottle(loading[i]);
        gsap.to(
          loading1,
          // { textContent: Math.round(Number(loading1.textContent)) },
          {
            textContent: per,
            duration: 0.5,
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
            duration: 0.5,
            ease: "power1.inOut",
          }
        );
        // loading2.textContent = Math.round(loading[1] * 100) + "%";
      }
      if (i == 2) {
        gsap.to(
          loading3,
          // { textContent: Math.round(Number(loading1.textContent)) },
          {
            textContent: Math.round(Number(loading[2]) * 100) + "%",
            duration: 0.5,
            ease: "power1.inOut",
          }
        );
        // loading3.textContent = Math.round(loading[2] * 100) + "%";
      }
    }
  );
};

export default loadModel;
