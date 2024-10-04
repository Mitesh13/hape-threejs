import * as THREE from "three";
const showLoader = (containerGroup) => {
  const torusGeometry = new THREE.TorusGeometry(1, 0.1, 16, 100, 0);
  torusGeometry.verticesNeedUpdate = true;
  torusGeometry.dynamic = true;

  const loadingMesh = new THREE.Mesh(
    torusGeometry,
    new THREE.MeshBasicMaterial()
  );
  loadingMesh.position.set(0, 1, 0);
  // containerGroup.add(loadingMesh);
  return loadingMesh;
};
export default showLoader;
