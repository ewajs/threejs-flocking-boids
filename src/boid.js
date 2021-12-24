import * as THREE from "three";
import { Vector3 } from "three";

export default class Boid {
  constructor(position = null, color = 0x000000, radius = 0.1) {
    this.position = position == null ? new Vector3() : position;
    this.radius = radius;
    this.boidGeometry = new THREE.SphereGeometry(radius, 64, 64);
    this.boidMaterial = new THREE.MeshBasicMaterial();
    this.boidMaterial.color = new THREE.Color(color);
    this.boidMesh = new THREE.Mesh(this.boidGeometry, this.boidMaterial);
    console.log(this.boidMesh);
    this.boidMesh.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
  }

  getBoidObject() {
    return this.boidMesh;
  }
}
