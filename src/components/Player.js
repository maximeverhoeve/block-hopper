import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { gui } from '../common/globals';

// const clock = new THREE.Clock();
const playerOptions = {
    height: 9,
    color: 0xff7600,
    speed: 0.2,
}


// Keycodes

const a = 65; 
const leftArrow = 37; // left arrow
const d = 68; // d
const rightArrow = 39; // right arrow

const guiPlayer = gui.addFolder('Player');
guiPlayer.add(playerOptions, 'height', 0.5, 20, 0.5).name('Jump height');
guiPlayer.add(playerOptions, 'speed', 0.1, 1.5, 0.1).name('Movement speed');
export default class Player {
    constructor({ material, geometry, world } = {}) {
        this.currentPos = 0;
        this.hasCollided = false;
        const width = 0.9;
        const height = 0.9;
        const depth = 0.9;

        // MESH
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
            mass: 1,
            position: new CANNON.Vec3(0, 4, 0),
            shape
        })
        world.addBody(this.body);

        // Collision

        const handleCollide = (e) => {
            if(!this.hasCollided && !e.body.isFloor) this.hasCollided = true;

            // Apply force on contact point to make explosion effect
            console.log(e);
        };
        this.body.addEventListener('collide', handleCollide)
        
        // Movement
        this.setupMovement();
    }

    setupMovement() {
        this.downKeys = [];
        document.addEventListener('keydown', ({ keyCode }) => {
            this.body.wakeUp();
            console.log(keyCode);
            if (!this.downKeys.includes(keyCode)) this.downKeys.push(keyCode);
        })
        document.addEventListener('keyup', ({ keyCode }) => {
            console.log(keyCode);
            const newDownKeys = [...this.downKeys];
            this.downKeys = newDownKeys.filter((dwnKey) => dwnKey !== keyCode);
        })
    }

    destroy() {
        // remove all event listeners and swipelisteners
    }

    jump() {
        if (this.body.position.y < 0.8) {
            this.body.wakeUp();
            this.body.velocity.y = playerOptions.height;
        }
    }

    handleMovement() {
        if (!this.hasCollided) {
            this.downKeys.forEach(k => {
                switch(k) {
                    case a:
                    case leftArrow: {
                        this.body.position.x -= 0.05;
                        break;
                    }
                    case d:
                    case rightArrow: { // move right        
                        this.body.position.x += 0.05;
                        this.body.velocity.x += 0.05;
                        break
                    }
                    case 87:  // w
                    case 38:  // arrow up
                    case 32: { // space
                        this.jump();
                        break;
                    }
                    default:
                        return;
                }
            })
        }
    }

    update() {
        // console.log(this.body.collisionResponse)
        // const elapsedTime = clock.1etElapsedTime();
        this.handleMovement();
        // this.mesh.position.y = Math.sin(2);
        this.mesh.position.copy(this.body.position);
        
        this.mesh.quaternion.copy(this.body.quaternion);
    }
};