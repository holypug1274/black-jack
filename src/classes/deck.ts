import { Card } from './card';
import { Cards } from '../enums/cards.enum';
import { Suits } from '../enums/suits.enum';

export class Deck {
    private cards: Card[] = [];
    private totalDecks: number;
    private deckSize: number = 52;

    constructor(totalDecks?: number) {
        this.totalDecks = !!totalDecks ? totalDecks : 1;
        this.cards = this.generateDeck();
    }

    public areCardsAlmostEnd(): boolean {
        return this.cards.length < (this.deckSize * this.totalDecks) / 2;
    }

    public remainingCards(): number {
        return this.cards.length;
    }

    public generateDeck(): Card[] {
        const deck: Card[] = [];
        const suitsKeys: Suits[] = Object.values(Suits) as Suits[];
        const cardsKeys: Cards[] = Object.values(Cards) as Cards[];

        for (let nd = 0; nd < this.totalDecks; nd++) {
            for (let ns = 0; ns < suitsKeys.length; ns++) {
                const suitsKey = suitsKeys[ns] as Suits;
                for (let nc = 0; nc < cardsKeys.length; nc++) {
                    const cardsKey = cardsKeys[nc];
                    deck.push(new Card(suitsKey, cardsKey));
                }
            }
        }

        return deck;
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public shuffle(): void {
        let cards = [];

        while (this.cards.length > 0) {
            const index = Math.floor(Math.random() * this.cards.length);
            const card = this.cards.splice(index, 1)[0];
            cards.push(card);
        }

        //simulate the casino split shuffle
        const middleIndex: number = cards.length % 2 == 0 ? cards.length - 1 : cards.length + 1;
        for (let n = 0; n < 5; n++) {
            const firstCardsHalf: Card[] = cards.slice(0, middleIndex);
            const secondCardsHalf: Card[] = cards.slice(middleIndex, cards.length);
            const cardsLocal: Card[] = [];
            while (firstCardsHalf.length > 0 || secondCardsHalf.length > 0) {
                if (firstCardsHalf.length > 0) cardsLocal.push(firstCardsHalf.pop());
                if (secondCardsHalf.length > 0) cardsLocal.push(secondCardsHalf.pop());
            }
            cards = cardsLocal;
        }

        this.cards = cards;
    }

    public drawCard(revealed: boolean = true): Card {
        const card = this.cards.pop();
        if (revealed) card.setVisibility(true);
        return card;
    }
}
