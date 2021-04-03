import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap/gsap-core';
import cannonDebugger from 'cannon-es-debugger';
import Floor from "../components/Floor";
import Player from "../components/Player";
import GameObjectManager from "../models/GameObjectManager";
import globals, { gui } from "./globals";
import Enemy from '../components/Enemy';
import Field from '../components/Field';

const GoManager = new GameObjectManager();
const clock = new THREE.Clock()
let oldElapsedTime = 0;
const fps = 1 / 60;
export default class MainScene {
    constructor({ scene, camera }) {
   
        this.scene = scene;
        this.camera = camera;
        // this.camera.position.y = 1;

        /**
         * Lights
         */

         const ambientLight = new THREE.AmbientLight(0xffffff, 1)
         scene.add(ambientLight)

         const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
         directionalLight.castShadow = true
         directionalLight.shadow.mapSize.set(1024, 1024)
         directionalLight.shadow.camera.far = 15
         directionalLight.shadow.camera.left = - 7
         directionalLight.shadow.camera.top = 7
         directionalLight.shadow.camera.right = 7
         directionalLight.shadow.camera.bottom = - 7
         directionalLight.position.set(2, 2, 1)
         scene.add(directionalLight)

        /**
         * Physic world
         */
        this.world = new CANNON.World();
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.allowSleep = true;
        this.world.gravity.set(0, -20, 0);

        // cannonDebugger(this.scene, this.world.bodies, {});

        gui.add(this.world.gravity, 'y', -100, 0, 1).name('World gravity');
        const defaultMaterial = new CANNON.Material('default');

        const defaultContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.1,
                restitution: 0.4  ,
            }
        );
        this.world.addContactMaterial(defaultContactMaterial);
        this.world.defaultContactMaterial = defaultContactMaterial;
        
        // Load textures 
        const loadingManger = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(loadingManger);
        // const matcapsTexture = textureLoader.load('/textures/matcaps/6.png')
        const matcapsTexture2 = textureLoader.load('/textures/matcaps/8.png')
        // Draw Field
        const field = GoManager.createGameObject(Field, {world: this.world});

        // Draw Player
        const material2 = new THREE.MeshMatcapMaterial({ matcap: matcapsTexture2,color: 0xcdff});
        const player = GoManager.createGameObject(Player, {material: null, world: this.world, onDead: () => this.handleDead(this)})
        player.mesh.material.matcap = matcapsTexture2;
        scene.add(player.mesh);


        this.camera.position.y = 2;
        gui.add(this.camera.position, 'x', 0, 10, 0.5).name('CameraPos x')
        gui.add(this.camera.position, 'y', 0, 10, 0.5).name('CameraPos y')
        gui.add(this.camera.position, 'z', 0, 10, 0.5).name('CameraPos z')

        camera.lookAt(new THREE.Vector3(0, 1, -2));

        // Draw Floor
        const floor = GoManager.createGameObject(Floor, { world: this.world })
        scene.add(floor.mesh);

        // DrawEnemy every 4 sec
        this.drawEnemy();
        this.enemyInterval = setInterval(() => this.drawEnemy(), 1000);

    }

    handleDead(mainScene) {
        clearInterval(this.enemyInterval);
        gsap.to(mainScene.camera.position, {y: 10, z: -1, duration: 3});
        gsap.to(mainScene.camera.rotation, {x: -Math.PI * 0.5, duration: 3});
    }

    drawEnemy() {
        const enemy = GoManager.createGameObject(Enemy, { world: this.world, scene: this.scene, onRemove: this.handleEnemyRemoval})
        this.scene.add(enemy.mesh);
    }

    handleEnemyRemoval(enemy) {
        GoManager.removeGameObject(enemy);
    }

    update() {
        const elapsedTime = clock.getElapsedTime()
        globals.deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;
        GoManager.update();
        // Update Physics world
        this.world.step(1 / 60, globals.deltaTime, 3);
    }
}