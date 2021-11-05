import { Bets } from '../enums/bets.enum';
import { Hand } from './hand';

export class Bet {
    private winningAmount: number;
    private costAmount: number;
    private type: Bets;

    constructor(type: Bets, baseBet: number) {
        this.type = type;

        switch (this.type) {
            case Bets.NORMAL:
                this.costAmount = baseBet;
                this.winningAmount = this.costAmount * 2;
                break;
            case Bets.DOUBLE:
                this.costAmount = baseBet * 2;
                this.winningAmount = this.costAmount * 2;
                break;
            case Bets.INSURANCE:
                this.costAmount = Math.ceil(baseBet / 2);
                this.winningAmount = this.costAmount * 2;
                break;
            case Bets.BLACKJACK:
                this.costAmount = baseBet;
                this.winningAmount = this.costAmount * 1.5;
                break;
        }
    }

    public getType(): Bets {
        return this.type;
    }

    public getName(): string {
        return Bets[this.type];
    }

    public getCostAmount(): number {
        return this.costAmount;
    }

    public getTotalWinningAmount(): number {
        return this.winningAmount;
    }

    public isWinningHand(handPlayer: Hand, handDealer: Hand): boolean {
        switch (this.type) {
            case Bets.NORMAL:
            case Bets.DOUBLE:
                return (
                    handPlayer.isScoreBlackJack() ||
                    (handPlayer.getCurrentScore() > handDealer.getCurrentScore() && !handPlayer.isScoreOverflow()) ||
                    (!handPlayer.isScoreOverflow() && handDealer.isScoreOverflow())
                );
            case Bets.INSURANCE:
                return handDealer.isScoreBlackJack();
            case Bets.BLACKJACK:
                return handPlayer.isScoreBlackJack();
        }
    }
}
