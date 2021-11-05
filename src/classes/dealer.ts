import { Deck } from './deck';
import { AbstractPlayer } from './player.abstract';

export class Dealer extends AbstractPlayer {
    constructor() {
        super('DEALER');
    }

    public hasMinimumScore(): boolean {
        return this.getHand().getCurrentScore() >= 17;
    }

    public play(deck: Deck): void {
        this.getHand().showCards();
        while (!this.getHand().isScoreBlackJack() && !this.getHand().isScoreOverflow() && !this.hasMinimumScore()) {
            this.getHand().drawCard(deck);
        }
    }
}
