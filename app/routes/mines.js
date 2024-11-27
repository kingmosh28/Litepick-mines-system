import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MinesRoute extends Route {
    @service store;
    @service socket;
    
    model() {
        return this.store.getLatestMines();
    }
    
    setupController(controller, model) {
        super.setupController(controller, model);
        this.socket.handleGameData.bind(this.socket);
    }
}
