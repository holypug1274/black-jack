import { Cards } from '../enums/cards.enum';
import { Suits } from '../enums/suits.enum';
import emoji from 'node-emoji';
import { Colors } from '../enums/colors.enum';

export class Card {
    public suit: Suits;
    public card: Cards;
    public color: Colors;
    public visible: boolean = false;

    constructor(suit: Suits, card: Cards) {
        this.suit = suit;
        this.card = card;
        this.color = this.suit == Suits.CLUBS || this.suit == Suits.SPADES ? Colors.BLACK : Colors.RED;
    }

    public getCardName(): string {
        return `${emoji.get(this.suit.toLowerCase())} ${this.card}`;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public setVisibility(visibility: boolean): void {
        this.visible = visibility;
    }

    public getValue(): number {
        let value: number;
        switch (this.card) {
            case Cards.JACK:
            case Cards.QUEEN:
            case Cards.KING:
                value = 10;
                break;
            case Cards.ACE:
                //special case managed by player class
                value = 1;
                break;
            default:
                value = parseInt(this.card);
                break;
        }
        return value;
    }
}
