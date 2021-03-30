import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SwipeListener from 'swipe-listener';
import { gui } from '../common/globals';


export default class Enemy {
    constructor({ world } = {}) {
        this.currentPos = 0;
        const width = 1;
        const height = 1;
        const depth = 1;
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        this.material = new THREE.MeshStandardMaterial({
            metalness: 0.4,
            roughness: 0.8,
            color: 0xffffff
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // this.mesh.castShadow = true;


        // Physics body
        const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

        this.body = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, height / 2, -3 ),
            shape
        })
        world.addBody(this.body);
        
    }

    destroy() {
        // remove all event listeners and swipelisteners
    };

    update() {

        // Physics update
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
};