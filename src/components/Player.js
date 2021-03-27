import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import { gui } from '../common/globals';

// const clock = new THREE.Clock();
const jumpOptions = {
    height: 2,
    duration: 0.3
}
gui.add(jumpOptions, 'height', 0.5, 3, 0.1).name('Jump height');
gui.add(jumpOptions, 'duration', 0.05, 1, 0.05).name('Jump duration');
export default class Player {
    constructor({ material, geometry} = {}) {
        if (!geometry) this.geometry = new THREE.BoxGeometry(1, 1, 1);
        else this.geometry = geometry
        if (!material) this.material = new THREE.MeshBasicMaterial({ color: 0xfffff0 });
        else this.material = material
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // listen to keydown for jumping
        document.addEventListener('keydown', ({ keyCode }) => {
            if (keyCode === 32) this.jump();
        })
        
    }

    jump() {
        gsap.to(this.mesh.position, {y: jumpOptions.height,ease: 'power1.out', duration: jumpOptions.duration})
        setTimeout(() => gsap.to(this.mesh.position, { y: 0, ease: 'power1.in', duration: jumpOptions.duration }), jumpOptions.duration * 1000);
    }

    update() {
        // const elapsedTime = clock.getElapsedTime();
        // this.mesh.position.y = Math.sin(2);
    }
};