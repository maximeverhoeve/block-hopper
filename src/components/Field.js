import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SwipeListener from 'swipe-listener';
import { enemyParams, gui } from '../common/globals';

export default class Field {
    constructor({ world } = {}) {
        const width = 1;
        const height = 8;
        const depth = 20;        
        
        // Physics body
        const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
        
        this.body1 = new CANNON.Body({
            mass: 0,
            position:  new CANNON.Vec3(-2.2, height / 2, (-depth / 2) + 2),
            shape,
            allowSleep: false,
        })
        this.body1.name = 'leftWall';
        world.addBody(this.body1);   

        // right wall
        this.body2 = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(2.2, height / 2, (-depth / 2) + 2),
            shape,
            allowSleep: false,
        })
        this.body2.name = 'rightWall';
        world.addBody(this.body2);   
    }

    update() {
     // code
    }
};