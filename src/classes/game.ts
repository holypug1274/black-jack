import { Deck } from './deck';
import { Match } from './match';
import { Player } from './player';
import readlineSync from 'readline-sync';
import { Logger } from './logger';
import { Dealer } from './dealer';
import { Hand } from './hand';

export class Game {
    private totalPlayers: number = 1;
    private totalDecks: number = 2;
    private playerMoney: number = 20;
    private initialBet: number = 5;
    private dealer: Dealer = new Dealer();
    private players: Player[] = [];
    private deck: Deck;
    private currentMatch: Match;

    constructor() {
        Logger.SCREEN_logGameIntro();

        this.readInputSettings();

        let choose = readlineSync.question(`Let's start the game! (y/n): `);

        while (this.players.length > 0 && choose.toLowerCase() === 'y') {
            this.startNewMatch();
            this.players = this.players
                .filter((player) => player.canMakeBet(this.initialBet))
                .map((player) => {
                    player.resetHands();
                    return player;
                });
            Logger.logEmptyLine();
            this.readInputContinueToPlay();
        }

        Logger.SCREEN_logClosing();
        process.exit(0);
    }

    private startNewMatch(): void {
        delete this.currentMatch;
        this.dealer.resetHands();
        if (!this.deck || this.deck.areCardsAlmostEnd()) {
            this.deck = new Deck(this.totalDecks);
            this.deck.shuffle();
        }
        this.setPlayersInitialCards();
        this.currentMatch = new Match(this.deck, this.initialBet, this.dealer, this.players);
    }

    private setPlayersInitialCards(): void {
        const dealerHand = new Hand();
        dealerHand.addCard(this.deck.drawCard(false));
        this.players.forEach((player) => {
            const playerHand = new Hand();
            playerHand.addCard(this.deck.drawCard());
            playerHand.addCard(this.deck.drawCard());
            player.addHand(playerHand);
        });
        dealerHand.addCard(this.deck.drawCard());
        this.dealer.addHand(dealerHand);
    }

    private readInputSettings(): void {
        let choose = readlineSync.question(`How many players are playing? (min 1 - max 7): `);
        while (isNaN(choose) || choose < 1 || choose > 7) {
            choose = readlineSync.question(`INVALID VALUE. Insert number of players (min 1 - max 7): `);
        }

        for (let n = 0; n < choose; n++) {
            let name = readlineSync.question(`Insert Player ${n + 1} name (will be truncated to 6 letters): `);
            this.players.push(new Player(name, this.playerMoney));
        }
    }

    private readInputContinueToPlay(): void {
        let choose = readlineSync.question(`Continue to play? (y/n): `);
        while (choose !== 'n' && choose !== 'y') {
            choose = readlineSync.question(`INVALID VALUE. Continue to play? (y/n): `);
        }
    }
}
