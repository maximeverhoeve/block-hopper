// import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
// import { gui } from '../common/globals';

export default class Floor {
    constructor({ world } = {}) {
        const geometry = new THREE.PlaneGeometry(50,30);
        // const material = new THREE.MeshBasicMaterial({ wireframe: false, color: '#100C25' });
        const material = new THREE.ShadowMaterial({
            // color: '#0b081a',
            // color: '#F9F3DE',
            // metalness: 0.3,
            // roughness: 0.4,
        });
        material.opacity = 0.05;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI * -0.5;
        this.mesh.position.z = -10;
        this.mesh.receiveShadow = true;

        // Physics 
        const floorShape = new CANNON.Plane();
        const floorBody = new CANNON.Body();
        floorBody.mass = 0;
        floorBody.addShape(floorShape);
        floorBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(-1, -0.01, 0),
            Math.PI * 0.5
        )
        floorBody.isFloor = true;
        world.addBody(floorBody);
    }

    update() {
        // const elapsedTime = clock.getElapsedTime();
        // this.mesh.position.y = Math.sin(2);
    }
};