import { Bets } from '../enums/bets.enum';
import { Deck } from './deck';
import { Hand } from './hand';
import { AbstractPlayer } from './player.abstract';

export class Player extends AbstractPlayer {
    private money: number = 0;

    constructor(name: string, money: number = 0) {
        super(name);
        this.money = money;
    }

    public addRemoveMoney(amount: number): void {
        this.money = amount < 0 ? this.money - Math.abs(amount) : this.money + amount;
    }

    public getMoney(): number {
        return this.money;
    }

    public splitCards(deck: Deck): void {
        const hand1 = this.getHand();
        const normalBet = hand1.getBet(Bets.NORMAL);
        const [card1, card2] = hand1.getCards();

        hand1.resetCards();
        hand1.addCard(card1);
        hand1.addCard(deck.drawCard());
        hand1.markAsSplitted();

        const hand2: Hand = new Hand();
        hand2.makeBet(this, Bets.NORMAL, normalBet.getCostAmount());
        hand2.addCard(card2);
        hand2.addCard(deck.drawCard());
        hand2.markAsSplitted();

        this.addHand(hand2);
    }

    public canMakeBet(toBet: number): boolean {
        return this.money >= toBet;
    }

    public hasSplitted(): boolean {
        return this.getHands().length > 1;
    }
}
