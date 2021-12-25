import * as THREE from "three";
import { Vector3 } from "three";

export default class Boid {
  constructor(
    position = null,
    color = 0x000000,
    radius = 0.1,
    perceptionRadius = 1,
    maxVelocity = 0.1,
    maxOffset = 5
  ) {
    this.position =
      position == null ? this.getRandomVector(maxOffset) : position;
    this.maxOffset = maxOffset;
    this.radius = radius;
    this.perceptionRadius = perceptionRadius;
    this.boidGeometry = new THREE.SphereGeometry(radius, 64, 64);
    this.boidMaterial = new THREE.MeshBasicMaterial();
    this.boidMaterial.color = new THREE.Color(color);
    this.boidMesh = new THREE.Mesh(this.boidGeometry, this.boidMaterial);
    this.setBoidPosition();
    this.maxVelocity = maxVelocity;
    this.velocity = this.getRandomVector(maxVelocity);
    this.acceleration = new Vector3();
  }

  getBoidObject() {
    return this.boidMesh;
  }

  getRandomVector(maxMagnitude) {
    const vector = new Vector3();
    vector.randomDirection();
    vector.setLength(Math.random() * maxMagnitude);
    return vector;
  }

  setBoidPosition() {
    this.boidMesh.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
  }

  calculateTotalForce(flock) {
    const alignmentForce = new Vector3();
    const cohesionForce = new Vector3();
    const separationForce = new Vector3();
    let boidsWithinPerceptionRadius = 0;

    for (let boid of flock) {
      // Do nothing for myself or boids beyond my perception radius
      const distance = this.position.distanceTo(boid.position);
      if (boid == this || distance > this.perceptionRadius) continue;
      // Count this void
      boidsWithinPerceptionRadius++;
      // Accumulate velocities to get average alignment and then compute alignment force
      alignmentForce.add(boid.velocity);
      // Accumulate positions to get cluster center and then compute cohesion force
      cohesionForce.add(boid.position);
      if (distance < 0.2 * this.perceptionRadius)
        separationForce.add(
          this.position
            .sub(boid.position)
            .setLength(1 / (distance * distance))
            .multiplyScalar(-1)
        );
    }

    const totalForce = new Vector3();

    if (boidsWithinPerceptionRadius > 0) {
      // The alignment force is the average velocity of the flocks within Perception Radius
      alignmentForce.divideScalar(boidsWithinPerceptionRadius);
      // The cohesion force is a vector pointing to the average positon
      cohesionForce.divideScalar(boidsWithinPerceptionRadius);
      cohesionForce.sub(this.position);
      separationForce.divideScalar(boidsWithinPerceptionRadius);
      totalForce.add(alignmentForce);
      totalForce.add(cohesionForce);
      totalForce.add(separationForce);
    }
    // After applying the forces from the flock model, we apply forces to keep them bounded in a volume
    // by adding a constant force in the opposite direction
    if (this.position.x < -this.maxOffset && totalForce.x < 0) totalForce.x = 1;
    else if (this.position.x > this.maxOffset && totalForce.x > 0)
      totalForce.x = -1;
    if (this.position.y < -this.maxOffset && totalForce.y < 0) totalForce.y = 1;
    else if (this.position.y > this.maxOffset && totalForce.y > 0)
      totalForce.y = -1;
    if (this.position.z < -this.maxOffset && totalForce.z < 0) totalForce.z = 1;
    else if (this.position.z > this.maxOffset && totalForce.z > 0)
      totalForce.z = -1;
    return totalForce;
  }

  update(flock) {
    this.acceleration = this.calculateTotalForce(flock);
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, this.maxVelocity);
    this.setBoidPosition();
  }
}
