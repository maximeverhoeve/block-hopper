import BasicCube from "../components/BasicCube";
import GameObjectManager from "../models/GameObjectManager";
import { gui } from "./globals";

export default ({scene}) => {
    const GoManager = new GameObjectManager();
    // Draw cube
    const Cube = GoManager.createGameObject(BasicCube)
    gui.add(Cube.mesh.position, 'x', -1, 1, 0.01);
    gui.add(Cube.mesh.position, 'y', -1, 1, 0.01);
    gui.add(Cube.mesh.position, 'z', -1, 1, 0.01);
    scene.add(this.Cube.mesh);

    const update = () => {
        GoManager.update();
    }
    return update;
}