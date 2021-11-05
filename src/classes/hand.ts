import { Bets } from '../enums/bets.enum';
import { Cards } from '../enums/cards.enum';
import { Choices } from '../enums/choices.enum';
import { Bet } from './bet';
import { Card } from './card';
import { Dealer } from './dealer';
import { Deck } from './deck';
import { Player } from './player';

export class Hand {
    private cards: Card[] = [];
    private bets: Bet[] = [];
    private hasSplitted: boolean;
    private lastChoose: Choices;
    private _done: boolean;
    private active: boolean = false;

    public setActive(active: boolean): void {
        this.active = active;
    }

    public isActive(): boolean {
        return this.active;
    }

    public drawCard(deck: Deck, revealed: boolean = true): void {
        const card = deck.drawCard(revealed);
        this.addCard(card);
    }

    public addCard(card: Card): void {
        this.cards.push(card);
    }

    public resetCards(): void {
        this.cards = [];
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public showCards(): void {
        this.cards.forEach((card) => {
            if (!card.isVisible()) card.setVisibility(true);
        });
    }

    public getCardsToPrint(): Card[] {
        return this.cards.filter((card) => card.isVisible());
    }

    public markAsSplitted(): void {
        this.hasSplitted = true;
    }

    public isSplitted(): boolean {
        return this.hasSplitted;
    }

    public canSplitCards(player: Player): boolean {
        const normalBet = this.getBet(Bets.NORMAL);
        return (
            !!normalBet &&
            this.cards.length === 2 &&
            this.cards[0].getValue() === this.cards[1].getValue() &&
            !this.hasSplitted &&
            this.bets.length === 1 &&
            player.getMoney() > normalBet.getCostAmount() * 2
        );
    }

    public isScoreOverflow(): boolean {
        return this.getCurrentScore() > 21;
    }

    public isScore21(): boolean {
        return this.getCurrentScore() == 21;
    }

    public isScoreBlackJack(): boolean {
        return (
            this.isScore21() &&
            this.cards.length === 2 &&
            !!this.cards.find((card) => card.card === Cards.ACE) &&
            !!this.cards.find(
                (card) =>
                    card.card === Cards.TEN ||
                    card.card === Cards.JACK ||
                    card.card === Cards.QUEEN ||
                    card.card === Cards.KING
            )
        );
    }

    public getCurrentScore(): number {
        var aces = 0;
        let currentScore = this.cards
            .filter((card) => card.isVisible())
            .reduce((score, card) => {
                card.card === Cards.ACE ? aces++ : (score += card.getValue());

                return score;
            }, 0);

        for (var n = aces; n > 0; n--) {
            currentScore > 11 - n ? (currentScore += 1) : (currentScore += 11);
        }

        return currentScore;
    }

    public getTotalBetAmount(): number {
        return this.bets.reduce((tot, bet) => {
            tot += bet.getCostAmount();
            return tot;
        }, 0);
    }

    public getBet(betType: Bets): Bet {
        return this.bets.find((bet) => bet.getType() === betType);
    }

    public getBets(): Bet[] {
        return this.bets;
    }

    private removeBet(betType: Bets): void {
        const index = this.bets.findIndex((bet) => bet.getType() === betType);
        this.bets.splice(index, 1);
    }

    public hasDoubleBet(): boolean {
        return !!this.bets.find((bet) => bet.getType() === Bets.DOUBLE);
    }

    public hasInsuranceBet(): boolean {
        return !!this.bets.find((bet) => bet.getType() === Bets.INSURANCE);
    }

    public canHitCard(): boolean {
        return !this.isScore21() && !this.isScoreBlackJack() && !this.isScoreOverflow();
    }

    public canDoubleBet(player: Player): boolean {
        return this.getCards().length === 2 && player.getMoney() - this.getBet(Bets.NORMAL).getCostAmount() >= 0;
    }

    public canInsuranceBet(dealer: Dealer): boolean {
        return (
            !this.hasInsuranceBet() &&
            this.getCards().length === 2 &&
            dealer
                .getHand()
                .getCards()
                .find((card) => card.isVisible()).card === Cards.ACE
        );
    }

    public canPlay(): boolean {
        return (
            !this.isScoreOverflow() &&
            !this.isScore21() &&
            !this.isScoreBlackJack() &&
            !this.hasDoubleBet() &&
            this.lastChoose !== Choices.STAY
        );
    }

    public setChoose(choose: Choices): void {
        this.lastChoose = choose;
    }

    public makeBet(player: Player, betType: Bets, betAmount?: number): void {
        let bet: Bet;
        if (betType === Bets.NORMAL) {
            bet = new Bet(betType, betAmount);
        } else if (betType === Bets.INSURANCE || betType === Bets.DOUBLE || betType === Bets.BLACKJACK) {
            const normalBet = this.getBet(Bets.NORMAL);
            bet = new Bet(betType, normalBet.getCostAmount());
            if (betType === Bets.DOUBLE || betType === Bets.BLACKJACK) {
                this.removeBet(Bets.NORMAL);
                player.addRemoveMoney(normalBet.getCostAmount());
            }
        }
        this.bets.push(bet);
        player.addRemoveMoney(-bet.getCostAmount());
    }

    //TODO to remove?
    public done(): void {
        this._done = true;
    }

    public isDone(): boolean {
        return this._done;
    }

    public isTie(dealer: Dealer): boolean {
        return (
            !this.isScoreOverflow() &&
            !dealer.getHand().isScoreOverflow() &&
            this.getCurrentScore() === dealer.getHand().getCurrentScore()
        );
    }
}
