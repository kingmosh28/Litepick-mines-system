import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StoreService extends Service {
    @tracked minesHistory = [];
    
    push(type, data) {
        if (type === 'mines') {
            this.minesHistory.push(data);
        }
    }
    
    getLatestMines() {
        return this.minesHistory[this.minesHistory.length - 1];
    }
}
