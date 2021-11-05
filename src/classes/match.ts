import { Deck } from './deck';
import { Player } from './player';
import readlineSync from 'readline-sync';
import { Choices } from '../enums/choices.enum';
import { Bets } from '../enums/bets.enum';
import { Logger } from './logger';
import { Dealer } from './dealer';
import { Hand } from './hand';

export class Match {
    private initialBet: number;
    private deck: Deck;
    private dealer: Dealer;
    private players: Player[];

    constructor(deck: Deck, initialBet: number, dealer: Dealer, players: Player[]) {
        this.deck = deck;
        this.initialBet = initialBet;
        this.dealer = dealer;
        this.players = players;

        for (const player of this.players) {
            Logger.SCREEN_logPlayerStartTurn(player);

            for (const hand of player.getHands()) {
                if (!hand.isSplitted()) {
                    let choose = this.readInputBet(player);
                    hand.makeBet(player, Bets.NORMAL, choose);
                }
                this.playHand(player, hand);
                hand.markAsDone();
                Logger.SCREEN_logPlayerPlay(this.dealer, player, hand);
                this.readInputGoNextHand();
            }
        }

        this.dealer.play(this.deck);

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            this.checkWinAndPay(player);
            this.readInputGoNextPlayer(i);
        }
    }

    private playHand(player: Player, hand: Hand): void {
        hand.setActive(true);
        while (
            hand.canPlay() &&
            !this.dealer.getHand().isScoreOverflow() &&
            !this.dealer.hasMinimumScore() &&
            !this.dealer.getHand().isScoreBlackJack()
        ) {
            const choices: Choices[] = this.getHandMatchOptions(hand, player);

            Logger.SCREEN_logPlayerPlay(this.dealer, player, hand);
            Logger.logPlayerQuestion();
            Logger.logPlayerChoises(choices);

            let typedChoice: string = this.readInputHandChoices(choices);

            hand.setChoose(parseInt(typedChoice));

            switch (parseInt(typedChoice) as Choices) {
                case Choices.CARD: {
                    hand.drawCard(this.deck);
                    break;
                }
                case Choices.DOUBLE: {
                    hand.makeBet(player, Bets.DOUBLE);
                    hand.drawCard(this.deck);
                    break;
                }
                case Choices.SPLIT: {
                    player.splitCards(this.deck);
                    break;
                }
                case Choices.INSURANCE: {
                    hand.makeBet(player, Bets.INSURANCE);
                    break;
                }
            }
        }
        hand.setActive(false);
    }

    private getHandMatchOptions(hand: Hand, player: Player): Choices[] {
        const options: Choices[] = [Choices.STAY];
        if (hand.canHitCard()) options.push(Choices.CARD);
        if (hand.canDoubleBet(player)) options.push(Choices.DOUBLE);
        if (hand.canSplitCards(player) && !hand.isSplitted()) options.push(Choices.SPLIT);
        if (hand.canInsuranceBet(this.dealer)) options.push(Choices.INSURANCE);

        return options;
    }

    private checkWinAndPay(player: Player): void {
        player.getHands().forEach((hand, index) => {
            if (hand.isScoreBlackJack()) {
                hand.makeBet(player, Bets.BLACKJACK);
            }
            const prize: number = hand.getBets().reduce((prize, bet) => {
                prize = bet.isWinningHand(hand, this.dealer.getHand())
                    ? prize + bet.getTotalWinningAmount()
                    : prize - bet.getCostAmount();
                return prize;
            }, 0);

            player.addRemoveMoney(prize);

            Logger.SCREEN_logPlayerPlay(this.dealer, player, hand);
            if (!player.canMakeBet(this.initialBet) && index + 1 === player.getHands().length)
                Logger.logPlayerEliminated(player);
            if (index + 1 != player.getHands().length) this.readInputGoNextHand();
        });
    }

    private readInputBet(player: Player): number {
        let choose = readlineSync.question(`Place your bet (min ${this.initialBet}): `);
        while (isNaN(choose) || choose < this.initialBet || choose > player.getMoney()) {
            if (choose > player.getMoney())
                choose = readlineSync.question(`AMOUNT LIMIT EXECED. Place your bet (min ${this.initialBet}): `);
            else choose = readlineSync.question(`INVALID VALUE. Place your bet (min ${this.initialBet}): `);
        }

        return choose;
    }

    private readInputGoNextPlayer(i: number): void {
        if (i + 1 < this.players.length) {
            let choose = readlineSync.question(`Check next player (type n): `);
            while (choose !== 'n') {
                choose = readlineSync.question(`INVALID VALUE. Check next player (type n): `);
            }
        }
    }

    private readInputGoNextHand(): void {
        let choose = readlineSync.question(`Check next hand (type p): `);
        while (choose !== 'p') {
            choose = readlineSync.question(`INVALID VALUE. Check next hand (type p): `);
        }
    }

    private readInputHandChoices(choices: Choices[]): string {
        let typedChoice: string = readlineSync.question('Insert available choice: ');

        while (!choices.find((choice) => choice == parseInt(typedChoice))) {
            typedChoice = readlineSync.question('INVALID VALUE. Insert available choice: ');
        }

        return typedChoice;
    }
}
