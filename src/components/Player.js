import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { gui } from '../common/globals';

// const clock = new THREE.Clock();
const playerOptions = {
    height: 9,
    color: 0xbb5c02,
    speed: 0.2,
}
const guiPlayer = gui.addFolder('Player');
guiPlayer.add(playerOptions, 'height', 0.5, 20, 0.5).name('Jump height');
guiPlayer.add(playerOptions, 'speed', 0.1, 1.5, 0.1).name('Movement speed');
export default class Player {
    constructor({ material, geometry, world } = {}) {
        const width = 1;
        const height = 1;
        const depth = 1;
        if (!geometry) this.geometry = new THREE.BoxGeometry(width, height, depth);
        else this.geometry = geometry
        if (!material) this.material = new THREE.MeshStandardMaterial({
            metalness: 0.4,
            roughness: 0.8,
            color: playerOptions.color
        });
        else this.material = material
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        guiPlayer.addColor(playerOptions, 'color').onChange(() => this.material.color.set(playerOptions.color));
        // Physics body
        const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

        this.body = new CANNON.Body({
            mass: 2000,
            position: new CANNON.Vec3(0, 10, 0),
            shape
        })
        // this.body.position.copy(this.mesh.position);
        // this.body.mass = 1000;
        world.addBody(this.body);
        
        this.setupMovement();
    }

    setupMovement() {
        // listen to keydown for jumping
        this.currentPos = 0;
        document.addEventListener('keydown', ({ keyCode }) => {
            const a = 65; 
            const leftArrow = 37; // left arrow
            const d = 68; // d
            const rightArrow = 39; // right arrow
            switch (keyCode) {
                case a:
                case leftArrow: { // move left
                    if (this.currentPos > -1) this.currentPos -= 1;
                    break;
                }
                case d:
                    case rightArrow: { // move right
                        if (this.currentPos < 1) this.currentPos += 1;
                    break;
                }
                case 32: { // space
                    this.jump();
                    break;
                }
                default:
                    break;
            };
            // go to new currentPos;
            gsap.to(this.body.position, { x: this.currentPos, duration: playerOptions.speed })
        })
    }

    jump() {
        if (this.body.position.y < 0.7) {
            this.body.wakeUp();
            this.body.velocity.y = playerOptions.height;
        }
    }

    update() {
        // const elapsedTime = clock.1etElapsedTime();
        // this.mesh.position.y = Math.sin(2);
        this.mesh.position.copy(this.body.position);
        // this.body.quaternion.x = 0
        this.body.quaternion.z = 0
        this.body.quaternion.y = 0
        this.mesh.quaternion.copy(this.body.quaternion);
    }
};