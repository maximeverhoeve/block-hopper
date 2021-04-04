import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import globals, { gui } from '../common/globals';
import gsap from 'gsap/gsap-core';

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
    constructor(props = {}) {
        this.props = props;
        const { material, geometry, world, onDead, scene } = props;
        this.onDead = onDead;
        this.scene = scene;
        this.world = world;
        this.geometry = geometry;
        this.material = material;

        this.currentPos = 0;
        this.hasCollided = false;
        this.world = world;
        
        this.width = 0.9;
        this.height = 0.9;
        this.depth = 0.9;

      
        this.spawn();
        this.collisionHandler();
        
        // Movement
        this.setupMovement();
    }

    spawn() {
          // MESH
          if (!this.geometry) this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
          if (!this.material) this.material = new THREE.MeshStandardMaterial({
              metalness: 0.4,
              roughness: 0.8,
              color: playerOptions.color
          });
          else this.material = material
          this.mesh = new THREE.Mesh(this.geometry, this.material);
          this.mesh.castShadow = true;
          guiPlayer.addColor(playerOptions, 'color').onChange(() => this.material.color.set(playerOptions.color));
  
  
          // Physics body
          const shape = new CANNON.Box(new CANNON.Vec3(this.width * 0.5, this.height * 0.5, this.depth * 0.5))
  
          this.body = new CANNON.Body({
              mass: 1,
              position: new CANNON.Vec3(0, 4, 0),
              shape,
              allowSleep: false,
          })
          this.body.fixedRotation = true;
          this.body.updateMassProperties();
          this.body.name = 'player';
          this.world.addBody(this.body);
          this.scene.add(this.mesh);
    }
    
    collisionHandler() {
         const handleCollide = (e) => {
            if(!this.hasCollided && e.body.name === 'enemy') {
                this.hasCollided = true;
                this.onDead(this);
            }

            // Apply force on contact point to make explosion effect
            if (!this.explosion  && !e.body.isFloor && !globals.gameOver) {
                this.explosion = true;
                this.body.fixedRotation = false;
                this.body.updateMassProperties();
                this.body.applyLocalForce(new CANNON.Vec3(0, 600, 0), new CANNON.Vec3(0, 1, 0));
            }
        };
        this.body.addEventListener('collide', handleCollide)
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

    resetPosition() {
        gsap.to(this.body.position, { x: 0, y: (this.height / 2), z: 0, duration: 0.8});
        gsap.to(this.body.quaternion, { x: 0, y: 0, z: 0, duration: 0.8}).then(() => {
        });
        this.hasCollided = false;
        this.explosion = false;
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
    }

    destroy() {
        // remove all event listeners and swipelisteners
        this.body.removeEventListener('collide', this.handleCollision);
        this.world.removeBody(this.body);
        this.material.dispose();
        this.geometry.dispose();
        this.scene.remove(this.mesh)
        this.onRemove(this);
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