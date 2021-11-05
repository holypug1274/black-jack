import { Cards } from '../enums/cards.enum';
import { Suits } from '../enums/suits.enum';
import { Card } from './card';

describe('Card', () => {
    let card: Card;

    beforeEach(() => {
        card = new Card(Suits.CLUBS, Cards.EIGHT);
    });

    test('isVisible', () => {
        expect(card.isVisible()).toBe(false);
        card.setVisibility(true);
        expect(card.isVisible()).toBe(true);
        card.setVisibility(false);
        expect(card.isVisible()).toBe(false);
    });

    test('getValue', () => {
        expect(card.getValue()).toBe(8);
        card = new Card(Suits.CLUBS, Cards.JACK);
        expect(card.getValue()).toBe(10);
        card = new Card(Suits.CLUBS, Cards.QUEEN);
        expect(card.getValue()).toBe(10);
        card = new Card(Suits.CLUBS, Cards.KING);
        expect(card.getValue()).toBe(10);
        card = new Card(Suits.CLUBS, Cards.ACE);
        expect(card.getValue()).toBe(1);
    });
});
