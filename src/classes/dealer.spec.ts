import { Cards } from '../enums/cards.enum';
import { Suits } from '../enums/suits.enum';
import { Card } from './card';
import { Dealer } from './dealer';
import { Hand } from './hand';

describe('Dealer', () => {
    let dealer: Dealer;
    let card1: Card;
    let card2: Card;

    beforeEach(() => {
        dealer = new Dealer();
    });

    test('hasMinimumScore', () => {
        let hand = new Hand();
        card1 = new Card(Suits.CLUBS, Cards.JACK);
        card2 = new Card(Suits.CLUBS, Cards.SEVEN);
        card1.setVisibility(true);
        card2.setVisibility(true);
        hand.addCard(card1);
        hand.addCard(card2);
        dealer.addHand(hand);
        expect(dealer.hasMinimumScore()).toBe(true);

        dealer.resetHands();

        hand = new Hand();
        card1 = new Card(Suits.CLUBS, Cards.JACK);
        card2 = new Card(Suits.CLUBS, Cards.EIGHT);
        card1.setVisibility(true);
        card2.setVisibility(true);
        hand.addCard(card1);
        hand.addCard(card2);
        dealer.addHand(hand);
        expect(dealer.hasMinimumScore()).toBe(true);

        dealer.resetHands();

        hand = new Hand();
        card1 = new Card(Suits.CLUBS, Cards.JACK);
        card2 = new Card(Suits.CLUBS, Cards.SIX);
        card1.setVisibility(true);
        card2.setVisibility(true);
        hand.addCard(card1);
        hand.addCard(card2);
        dealer.addHand(hand);
        expect(dealer.hasMinimumScore()).toBe(false);
    });
});
