import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class SocketService extends Service {
    @service store;
    @service mines;
    
    async handleGameData(data) {
        const { cookies, csrf_test_name } = data;
        const betResponse = await this.mines.placeBet(cookies, csrf_test_name);
        return betResponse;
    }
}
