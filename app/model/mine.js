import Model from '@ember/model';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';

export default class MinesModel extends Model {
    @tracked mines = new TrackedArray([]);
    @tracked betResponse = null;
    
    async placeBet(cookies, csrf) {
        const response = await fetch('https://litepick.io/process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `action=bet_game_mines&bet_amount=0.000001&num_mines=3&csrf_test_name=${csrf}`
        });
        
        this.betResponse = await response.json();
        this.mines.push(...this.betResponse.mines);
        return this.betResponse;
    }
}
