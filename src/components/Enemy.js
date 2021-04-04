import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SwipeListener from 'swipe-listener';
import globals, { enemyParams, gui } from '../common/globals';

export default class Enemy {
    constructor({ world, scene, matcap, onRemove } = {}) {
        this.currentPos = 0;
        this.name = 'enemy';
        this.world = world;
        this.scene = scene;
        this.onRemove = onRemove;
        const width = 1;
        const height = Math.round(Math.random() + 1) ;
        const depth = 1;
        const randomX = (Math.random() - 0.5) * 2;
        const spawnPos = new CANNON.Vec3(Math.round(randomX), height / 2, -60)
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        // this.material = new THREE.MeshStandardMaterial({
        //     metalness: 0.4,
        //     roughness: 0.8,
        //     color: 0x2ECFCA
        // });
        this.material = new THREE.MeshMatcapMaterial({ matcap: matcap});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // Shadows
        // this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        
        
        // Physics body
        const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
        
        this.body = new CANNON.Body({
            mass: 0,
            position: spawnPos,
            shape,
            allowSleep: false,
        })
        this.body.name = 'enemy';
        world.addBody(this.body);
        
        // collisions

        this.handleCollision = (e) => {
            if (!e.body.isFloor) {
                this.hasCollided = true;
            }

        }

        this.body.addEventListener('collide', this.handleCollision);
        
    }

    

    checkOutOfBoundaries() {
        if (this.body.position.z > enemyParams.removeDistance) {
            this.destroy()
        }
    }

    destroy() {
        // remove all event listeners and swipelisteners
        this.body.removeEventListener('collide', this.handleCollision);
        this.world.removeBody(this.body);
        this.material.dispose();
        this.geometry.dispose();
        this.scene.remove(this.mesh)
        this.onRemove(this);
    };

    update() {
        this.checkOutOfBoundaries();

            if (!this.hasCollided) this.body.position.z += globals.deltaTime * enemyParams.speed
        // Physics update
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
};