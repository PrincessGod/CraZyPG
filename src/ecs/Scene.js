import { Context } from 'czpg-ecs';

export class Scene extends Context {

    addSceneObject( so ) {

        return super.addEntity( so );

    }

    update() {

        return super.execute();

    }

}
