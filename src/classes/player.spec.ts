import { Bets } from '../enums/bets.enum';
import { Card } from './card';
import { Deck } from './deck';
import { Hand } from './hand';
import { Player } from './player';

describe('Player', () => {
    let player: Player;
    let deck: Deck;
    let card1: Card;
    let card2: Card;

    beforeEach(() => {
        player = new Player('Levi', 100);
        const hand = new Hand();
        hand.makeBet(player, Bets.NORMAL, 10);
        deck = new Deck(2);
        deck.shuffle();
        card1 = deck.drawCard();
        card2 = deck.drawCard();
        hand.addCard(card1);
        hand.addCard(card2);
        player.addHand(hand);
    });

    test('getMoney', () => {
        expect(player.getMoney()).toBe(90);
    });

    test('addRemoveMoney', () => {
        player.addRemoveMoney(40);
        expect(player.getMoney()).toBe(130);
        player.addRemoveMoney(-40);
        expect(player.getMoney()).toBe(90);
    });

    test('canMakeBet', () => {
        expect(player.canMakeBet(10)).toBe(true);
        expect(player.canMakeBet(90)).toBe(true);
        expect(player.canMakeBet(91)).toBe(false);
    });

    test('hasSplitted', () => {
        expect(player.hasSplitted()).toBe(false);
        player.splitCards(deck);
        expect(player.hasSplitted()).toBe(true);
    });

    test('splitCards', () => {
        player.splitCards(deck);
        const firstCardFirstHand = player.getHands()[0].getCards()[0];
        const firstCardSecondHand = player.getHands()[1].getCards()[0];
        expect(firstCardFirstHand.card).toBe(card1.card);
        expect(firstCardFirstHand.color).toBe(card1.color);
        expect(firstCardSecondHand.card).toBe(card2.card);
        expect(firstCardSecondHand.color).toBe(card2.color);
    });
});
