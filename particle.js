import * as THREE from "three";

class Particle {
  constructor(bloomGroup) {
    this.bloom = new THREE.Group();
    this.speedx = Math.random() * 5;
    this.speedy = Math.random() * 5;
    this.speedz = Math.random() * 5;
    this.bloom.position.x = (Math.random() - 0.5) * 5;
    this.bloom.position.y = Math.random() * 5;
    this.bloom.position.z = (Math.random() - 0.5) * 5;

    // for (var j = 0; j < 0.018; j += 0.003) {
    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 32, 16),
      new THREE.MeshLambertMaterial({
        color: "orange",
        transparent: true,
        opacity: 0.05,
      })
    );
    // sphere.material.opacity = Math.random() - 0.5;

    // gsap.to(sphere.material, {
    //   opacity: 0.1,
    //   duration: Math.random() + 1,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // });

    this.bloom.add(sphere);
    // for (var j = 0; j < 0.03; j += 0.005) {
    // }
    bloomGroup.add(this.bloom);
  }
  update = (color) => {
    if (this.bloom.position.x < -3) this.bloom.position.x = 3;
    else if (this.bloom.position.x > 3) this.bloom.position.x = -3;

    if (this.bloom.position.y < 0.5) this.bloom.position.y = 5;
    else if (this.bloom.position.y > 5) this.bloom.position.y = 0.5;

    if (this.bloom.position.z < -2) this.bloom.position.z = 5;
    else if (this.bloom.position.z > 5) this.bloom.position.z = -2;
    this.bloom.position.x += 0.001 * this.speedx;
    this.bloom.position.y += 0.001 * this.speedy;
    this.bloom.position.z += 0.001 * this.speedz;
    if (color) {
      this.bloom.children.forEach((sphere) => {
        console.log("color", color);
        if (color === "orange") sphere.material.opacity = 0.5;
        else sphere.material.opacity = 0.8;
        sphere.material.color = new THREE.Color(color);
      });
    }
  };
}
export default Particle;
