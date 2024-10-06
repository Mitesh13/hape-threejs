import * as THREE from "three";

const onModelLoad = (gltf, modelObj, afterLoad) => {
  try {
    let skeleton, model;
    let walkAction;
    let action;
    model = gltf.scene;
    model.position.x = 0.03;

    if (modelObj.hasOwnProperty("rotate")) model.rotation.y = modelObj.rotate;
    if (modelObj.hasOwnProperty("scale")) {
      model.scale.set(modelObj.scale, modelObj.scale, modelObj.scale);
    }

    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;

    model.userData = { modelObj, gltf };
    // ---------------------------------------------3D Object model init END----------------------------------------

    afterLoad(model, modelObj);
  } catch (e) {
    console.log("e", e);
  }
  // return mixer;
};

export default onModelLoad;
