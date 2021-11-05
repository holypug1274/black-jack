import chalk from 'chalk';
import { Bets } from '../enums/bets.enum';
import { Cards } from '../enums/cards.enum';
import { Choices } from '../enums/choices.enum';
import { Colors } from '../enums/colors.enum';
import { LineColors } from '../enums/lineColors.enum';
import { Bet } from './bet';
import { Card } from './card';
import { Dealer } from './dealer';
import { Hand } from './hand';
import { Player } from './player';

export class Logger {
    public static space = ' ';
    public static lineSize: number = 120;

    public static logEmptyLine(): void {
        console.log(`\n`);
    }

    public static clearLogs(): void {
        var lines = process.stdout.getWindowSize()[1];
        for (var i = 0; i < lines; i++) {
            console.log('\r\n');
        }
    }

    public static log(text: string): void {
        console.log(`${text}`);
    }
    public static logRed(text: string): void {
        console.log(`${chalk.white.bgRed(text)}`);
    }

    public static logGreen(text: string): void {
        console.log(`${chalk.black.bgGreen(text)}`);
    }

    public static logYellow(text: string): void {
        console.log(`${chalk.black.bgYellowBright(text)}`);
    }

    public static logBlue(text: string): void {
        console.log(`${chalk.white.bgBlue(text)}`);
    }

    public static logLine(color: LineColors = null, text: string = '', useBytes: boolean = false): void {
        const spaces = Logger.lineSize - (useBytes ? Math.ceil(text.length / 7) : text.length);
        let func;
        switch (color) {
            case LineColors.RED:
                func = Logger.logRed;
                break;
            case LineColors.GREEN:
                func = Logger.logGreen;
                break;
            case LineColors.BLUE:
                func = Logger.logBlue;
                break;
            case LineColors.YELLOW:
                func = Logger.logYellow;
                break;
            default:
                func = Logger.log;
        }
        func(
            `${Logger.space.repeat(Math.floor(spaces / 2) + 1)}${text}${Logger.space.repeat(Math.ceil(spaces / 2) + 1)}`
        );
    }

    public static getCardToPrint(cards: Card[]): string {
        let text: string = '';
        cards.forEach((card, index) => {
            const extraSpace: string = card.card !== Cards.TEN ? ' ' : '';
            text +=
                card.color === Colors.BLACK
                    ? chalk.black.bgWhite.bold(` ${extraSpace + card.getCardName() + extraSpace} `)
                    : chalk.red.bgWhite.bold(` ${extraSpace + card.getCardName() + extraSpace} `);
            if (index + 1 < cards.length) text += '  ';
        });
        return text;
    }

    public static SCREEN_logPlayerStartTurn(player: Player): void {
        Logger.clearLogs();
        Logger.logLine(LineColors.BLUE);
        Logger.logLine(LineColors.BLUE, `------------------------------------------------`);
        Logger.logLine(LineColors.BLUE, `Hey ${player.getName()}, is your turn!`);
        Logger.logLine(LineColors.BLUE, `------------------------------------------------`);
        Logger.logLine(LineColors.BLUE);

        Logger.logLine();

        Logger.logLine(LineColors.BLUE);
        Logger.logLine(LineColors.BLUE, `Money: ${player.getMoney()}€`);
        Logger.logLine(LineColors.BLUE);

        Logger.logLine();
    }

    public static logPlayerQuestion(): void {
        Logger.logLine(LineColors.BLUE);
        Logger.logLine(LineColors.BLUE, `What do you want to do?`);
        Logger.logLine(LineColors.BLUE);
    }

    public static logPlayerChoises(choices: Choices[]): void {
        Logger.logLine();
        choices.forEach((choice) => {
            switch (choice) {
                case Choices.STAY:
                    Logger.logLine(LineColors.BLUE, `${Choices.STAY}: stay`);
                    break;
                case Choices.CARD:
                    Logger.logLine(LineColors.BLUE, `${Choices.CARD}: hit a card`);
                    break;
                case Choices.DOUBLE:
                    Logger.logLine(LineColors.BLUE, `${Choices.DOUBLE}: double the bet`);
                    break;
                case Choices.SPLIT:
                    Logger.logLine(LineColors.BLUE, `${Choices.SPLIT}: split your hand`);
                    break;
                case Choices.INSURANCE:
                    Logger.logLine(LineColors.BLUE, `${Choices.INSURANCE}: make the insurance`);
                    break;
            }
        });
        Logger.logLine();
    }

    public static SCREEN_logGameIntro(): void {
        Logger.clearLogs();
        Logger.logLine(LineColors.RED);
        Logger.logLine(LineColors.RED, `------------------------------------------------`);
        Logger.logLine(LineColors.RED, `BLACKJACK`);
        Logger.logLine(LineColors.RED, `------------------------------------------------`);
        Logger.logLine(LineColors.RED);
        Logger.logLine(LineColors.GREEN, `RULES`);
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN, `A game ends when all players finish their money or they all quit`);
        Logger.logLine(LineColors.GREEN, `Each player begins with 50`);
        Logger.logLine(LineColors.GREEN, `The minimum bet to play is 5`);
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN, `HAVING FUN!`);
        Logger.logLine(LineColors.GREEN);
    }

    public static logRules(): void {
        Logger.logLine();
        Logger.logLine(LineColors.RED);
        Logger.logLine(LineColors.RED, `------------------------------------------------`);
        Logger.logLine(LineColors.RED, `Black Jack pays 3 to 2`);
        Logger.logLine(LineColors.RED, `Dealer must stand on 17 and draw on 16`);
        Logger.logLine(LineColors.RED, `Insurance pays 2 to 1`);
        Logger.logLine(LineColors.RED, `------------------------------------------------`);
        Logger.logLine(LineColors.RED);
        Logger.logLine();
    }

    public static SCREEN_logClosing(): void {
        Logger.clearLogs();
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN, `------------------------------------------------`);
        Logger.logLine(LineColors.GREEN, `BLACKJACK`);
        Logger.logLine(LineColors.GREEN, `------------------------------------------------`);
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN, `Thanks for playing!`);
        Logger.logLine(LineColors.GREEN);
    }

    public static logPlayerEliminated(player: Player): void {
        Logger.logLine();
        Logger.logLine(LineColors.RED);
        Logger.logLine(LineColors.RED, `${player.getName()} ELIMINATED - NO MORE MONEY`);
        Logger.logLine(LineColors.RED);
        Logger.logLine();
    }

    public static SCREEN_logPlayerPlay(dealer: Dealer, player: Player, hand: Hand, isEnd?: boolean): void {
        Logger.clearLogs();
        Logger.logRules();
        Logger.logDealer(dealer);

        Logger.logLine(LineColors.BLUE);
        Logger.logLine(LineColors.BLUE, `------------------------------------------------`);
        Logger.logLine(LineColors.BLUE, `${player.getName()} HAND`);
        Logger.logLine(LineColors.BLUE, `------------------------------------------------`);
        Logger.logLine(LineColors.BLUE);

        this.logPlayerHand(hand, dealer);

        Logger.logLine(LineColors.BLUE);
        Logger.logLine(LineColors.BLUE, `Money: ${player.getMoney()}€`);
        Logger.logLine(LineColors.BLUE);
    }

    public static logDealer(dealer: Dealer): void {
        Logger.logLine();
        Logger.logLine(LineColors.YELLOW);
        Logger.logLine(LineColors.YELLOW, `------------------------------------------------`);
        Logger.logLine(LineColors.YELLOW, `${dealer.getName()}`);
        Logger.logLine(LineColors.YELLOW);
        Logger.logLine(LineColors.YELLOW, `${Logger.getCardToPrint(dealer.getHand().getCardsToPrint())}`, true);
        Logger.logLine(LineColors.YELLOW);
        Logger.logLine(LineColors.YELLOW, `Cards Score: ${dealer.getHand().getCurrentScore()}`);
        Logger.logLine(LineColors.YELLOW);
        Logger.logLine(LineColors.YELLOW, `------------------------------------------------`);
        Logger.logLine(LineColors.YELLOW);
        Logger.logLine();
    }

    public static logPlayerHand(hand: Hand, dealer: Dealer, handIndex?: number): void {
        Logger.logLine();
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN, `${Logger.getCardToPrint(hand.getCardsToPrint())}`, true);
        Logger.logLine(LineColors.GREEN);
        Logger.logLine(LineColors.GREEN, `Cards Score: ${hand.getCurrentScore()}`);
        Logger.logLine(LineColors.GREEN);
        Logger.logBets(hand, dealer);
        Logger.logLine();
    }

    public static logBets(hand: Hand, dealer: Dealer): void {
        Logger.logLine();
        if (!hand.isTie(dealer)) {
            if (!hand.isDone()) {
                Logger.logLine(LineColors.BLUE);
                Logger.logLine(LineColors.BLUE, `------------------------------------------------`);
                Logger.logLine(LineColors.BLUE, `BETS ON THIS HAND`);
                Logger.logLine(LineColors.BLUE, `------------------------------------------------`);
                Logger.logLine(LineColors.BLUE);
            }
            hand.getBets().forEach((bet, index) => {
                this.logBet(hand, bet, dealer, index);
            });
        } else {
            Logger.logLine(LineColors.YELLOW, `HAND TIED - REFOUND OF ${hand.getTotalBetAmount()}€`);
        }
    }

    public static logBet(hand: Hand, bet: Bet, dealer: Dealer, index: number): void {
        Logger.logLine();
        if (!hand.isDone()) {
            if (bet.getType() === Bets.NORMAL) {
                Logger.logLine(LineColors.GREEN, `NORMAL (${bet.getCostAmount()}€)`);
            } else if (bet.getType() === Bets.INSURANCE) {
                Logger.logLine(LineColors.GREEN, `INSURANCE (${bet.getCostAmount()}€)`);
            } else if (bet.getType() === Bets.DOUBLE) {
                Logger.logLine(LineColors.GREEN, `DOUBLE DOWN (${bet.getCostAmount()}€)`);
            }
        }
        if (!!hand.isDone()) {
            if (bet.getType() === Bets.BLACKJACK && bet.isWinningHand(hand, dealer.getHand())) {
                Logger.logLine(LineColors.GREEN, `BLACKJACK (${bet.getCostAmount()}€)`);
            } else if (dealer.getHand().isScoreBlackJack() && !hand.isTie(dealer)) {
                Logger.logLine(LineColors.RED, `DEALER BLACKJACK`);
            }
            if (hand.isScoreOverflow()) Logger.logLine(LineColors.RED, `YOU OVERFLOWED`);
            else if (dealer.getHand().isScoreOverflow()) Logger.logLine(LineColors.RED, `DEALER OVERFLOWED`);
            if (bet.isWinningHand(hand, dealer.getHand())) {
                Logger.logLine(LineColors.GREEN, `YOU WIN ${bet.getTotalWinningAmount()}€`);
            } else {
                Logger.logLine(LineColors.RED, `YOU LOST ${bet.getCostAmount()}€`);
            }
        }
        if (index + 1 < hand.getBets().length) {
            Logger.logLine();
            Logger.logLine(LineColors.GREEN, `-----------------------`);
        }
    }
}
