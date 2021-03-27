import Player from "../components/Player";
import GameObjectManager from "../models/GameObjectManager";
import { gui } from "./globals";

const GoManager = new GameObjectManager();
export default class MainScene {
    constructor({ scene }) {
        this.scene = scene;

        // Draw Player
        const player = GoManager.createGameObject(Player)
        gui.add(player.mesh.position, 'x', -1, 1, 0.01);
        gui.add(player.mesh.position, 'y', -1, 1, 0.01);
        gui.add(player.mesh.position, 'z', -1, 1, 0.01);
        scene.add(player.mesh);
    }

    update() {
        GoManager.update();
    }
}