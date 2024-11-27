import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MinesController extends Controller {
    @service store;
    
    @action
    async handleMines(betResponse) {
        if (betResponse.ret === 1) {
            this.store.push('mines', {
                id: Date.now(),
                mines: betResponse.mines
            });
        }
    }
    
    @action
    clearMines() {
        this.model.mines.clear();
    }
}
