import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import globals, { gui } from '../common/globals';

// const clock = new THREE.Clock();
const playerOptions = {
    height: 9,
    color: 0xff7600,
    speed: 8,
}


// Keycodes

const a = 65; 
const leftArrow = 37; // left arrow
const d = 68; // d
const rightArrow = 39; // right arrow

const maxRight = 1;
const maxLeft = -1;

const guiPlayer = gui.addFolder('Player');
guiPlayer.add(playerOptions, 'height', 0.5, 20, 0.5).name('Jump height');
guiPlayer.add(playerOptions, 'speed', 1, 20, 1).name('Movement speed');
export default class Player {
    constructor({ material, geometry, world, onDead } = {}) {

        this.currentPos = 0;
        this.hasCollided = false;
        this.world = world;
        
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
            shape,
            allowSleep: false,
        })
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
        this.body.name = 'player';
        world.addBody(this.body);

        // Collision

        const handleCollide = (e) => {
            if(!this.hasCollided && e.body.name === 'enemy') {
                this.hasCollided = true;
                onDead(this);
            }

            // Apply force on contact point to make explosion effect
            if (!this.explosion  && !e.body.isFloor) {
                this.explosion = true;
                this.body.fixedRotation = false;
                this.body.updateMassProperties();
                this.body.applyLocalForce(new CANNON.Vec3(0, 600, 0), new CANNON.Vec3(0, 1, 0));
            }
        };
        this.body.addEventListener('collide', handleCollide)
        
        // Movement
        this.setupMovement();
    }

    setupMovement() {
        this.downKeys = [];
        document.addEventListener('keydown', ({ keyCode }) => {
            this.body.wakeUp();
            if (!this.downKeys.includes(keyCode)) this.downKeys.push(keyCode);
        })
        document.addEventListener('keyup', ({ keyCode }) => {
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
                        if (this.body.position.x >= maxLeft) {
                        this.body.position.x -= globals.deltaTime * playerOptions.speed;
                        }
                        break;
                    }
                    case d:
                    case rightArrow: { // move right  
                        if (this.body.position.x <= maxRight) {
                            this.body.position.x += globals.deltaTime * playerOptions.speed;
                        }
                        break
                    }
                    case 87:  // w
                    case 38:  // arrow up
                    case 32: { // space
                        this.jump();
                        break;
                    }
                    default:
                        
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