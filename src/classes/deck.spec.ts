import { Deck } from './deck';

describe('Deck', () => {
    let deck: Deck;

    beforeEach(() => {
        deck = new Deck(2);
        deck.shuffle();
    });

    test('areCardsAlmostEnd', () => {
        expect(deck.areCardsAlmostEnd()).toBe(false);
        for (let n = 0; n < Math.ceil(deck.remainingCards() / 2 + 40); n++) deck.drawCard();
        expect(deck.areCardsAlmostEnd()).toBe(true);
    });

    test('remainingCards', () => {
        expect(deck.remainingCards()).toBe(104);
    });

    test('getCards', () => {
        expect(deck.getCards().length).toBe(104);
    });

    test('shuffle', () => {
        const card = deck.getCards()[0];
        deck.shuffle();
        expect(deck.getCards()[0]).not.toMatchObject(card);
    });
});
