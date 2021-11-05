import { Deck } from './deck';
import { Bets } from '../enums/bets.enum';
import { Card } from './card';
import { Hand } from './hand';
import { Player } from './player';
import { Dealer } from './dealer';
import { Suits } from '../enums/suits.enum';
import { Cards } from '../enums/cards.enum';

describe('Hand', () => {
    function setPlayersInitialCards(dealer: Dealer, player: Player, cards: Card[], playerHand: Hand): Hand {
        const dealerHand = new Hand();
        cards[0].setVisibility(false);
        dealerHand.addCard(cards[0]);

        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cards[1]);
        playerHand.addCard(cards[2]);
        player.addHand(playerHand);

        dealerHand.addCard(cards[3]);
        dealer.addHand(dealerHand);

        return playerHand;
    }

    let dealer: Dealer;
    let player: Player;
    let playerHand: Hand;

    let deck: Deck;
    let cardAC: Card;
    let card2: Card;
    let card3: Card;
    let card4: Card;
    let card5: Card;
    let card6: Card;
    let card7: Card;
    let card8: Card;
    let card9: Card;
    let card10: Card;
    let cardJ: Card;
    let cardAD: Card;

    beforeEach(() => {
        deck = new Deck();
        cardAC = new Card(Suits.CLUBS, Cards.ACE);
        card2 = new Card(Suits.CLUBS, Cards.TWO);
        card3 = new Card(Suits.CLUBS, Cards.THREE);
        card4 = new Card(Suits.CLUBS, Cards.FOUR);
        card5 = new Card(Suits.CLUBS, Cards.FIVE);
        card6 = new Card(Suits.CLUBS, Cards.SIX);
        card7 = new Card(Suits.CLUBS, Cards.SEVEN);
        card8 = new Card(Suits.CLUBS, Cards.EIGHT);
        card9 = new Card(Suits.CLUBS, Cards.NINE);
        card10 = new Card(Suits.CLUBS, Cards.TEN);
        cardJ = new Card(Suits.CLUBS, Cards.JACK);
        cardAD = new Card(Suits.DIAMONDS, Cards.ACE);

        cardAC.setVisibility(true);
        card2.setVisibility(true);
        card3.setVisibility(true);
        card4.setVisibility(true);
        card5.setVisibility(true);
        card5.setVisibility(true);
        card6.setVisibility(true);
        card7.setVisibility(true);
        card8.setVisibility(true);
        card9.setVisibility(true);
        card10.setVisibility(true);
        cardJ.setVisibility(true);
        cardAD.setVisibility(true);

        const cards = [card2, card3, card4, card5, card6, card7, card8, card9, card10, cardAC, cardAD, cardJ];

        dealer = new Dealer();
        player = new Player('AAA', 100);

        playerHand = setPlayersInitialCards(dealer, player, cards, playerHand);
    });

    test('activate', () => {
        expect(playerHand.isActive()).toBe(false);
        playerHand.setActive(true);
        expect(playerHand.isActive()).toBe(true);
        playerHand.setActive(false);
        expect(playerHand.isActive()).toBe(false);
    });

    test('drawCard', () => {
        expect(playerHand.getCards().length).toBe(2);
        playerHand.drawCard(deck);
        expect(playerHand.getCards().length).toBe(3);
    });

    test('addCard', () => {
        expect(playerHand.getCards().length).toBe(2);
        playerHand.addCard(card2);
        expect(playerHand.getCards().length).toBe(3);
    });

    test('getCardsToPrint', () => {
        expect(playerHand.getCardsToPrint().length).toBe(2);
        playerHand.getCards()[0].setVisibility(false);
        expect(playerHand.getCardsToPrint().length).toBe(1);
        playerHand.drawCard(deck);
        expect(playerHand.getCardsToPrint().length).toBe(2);
        playerHand.drawCard(deck, false);
        expect(playerHand.getCardsToPrint().length).toBe(2);
    });

    test('canSplitCards', () => {
        expect(playerHand.canSplitCards(player)).toBe(false);
        console.log(playerHand.getCards());
        console.log(playerHand.getCurrentScore());

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(card10);
        playerHand.addCard(cardJ);
        player.addHand(playerHand);

        console.log(playerHand.getCards());
        console.log(playerHand.getCurrentScore());

        expect(playerHand.canSplitCards(player)).toBe(true);
    });

    test('isScoreOverflow', () => {
        expect(playerHand.isScoreOverflow()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(card8);
        playerHand.addCard(card9);
        playerHand.addCard(card10);
        player.addHand(playerHand);

        expect(playerHand.isScoreOverflow()).toBe(true);
    });

    test('isScore21', () => {
        expect(playerHand.isScore21()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(card10);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAC);
        player.addHand(playerHand);

        expect(playerHand.isScore21()).toBe(true);
    });

    test('isScoreBlackJack', () => {
        expect(playerHand.isScoreBlackJack()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAC);
        player.addHand(playerHand);

        expect(playerHand.isScoreBlackJack()).toBe(true);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(card10);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAC);
        player.addHand(playerHand);

        expect(playerHand.isScoreBlackJack()).toBe(false);
    });

    test('getCurrentScore', () => {
        expect(playerHand.getCurrentScore()).toBe(7);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(card9);
        playerHand.addCard(card10);
        player.addHand(playerHand);

        expect(playerHand.getCurrentScore()).toBe(19);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardAC);
        playerHand.addCard(cardAD);
        playerHand.addCard(cardJ);
        player.addHand(playerHand);

        expect(playerHand.getCurrentScore()).toBe(12);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardAC);
        playerHand.addCard(cardAD);
        playerHand.addCard(cardJ);
        playerHand.addCard(card3);
        player.addHand(playerHand);

        expect(playerHand.getCurrentScore()).toBe(15);
    });

    test('getTotalBetAmount', () => {
        expect(playerHand.getTotalBetAmount()).toBe(5);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.DOUBLE);
        player.addHand(playerHand);

        expect(playerHand.getTotalBetAmount()).toBe(10);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.INSURANCE);
        player.addHand(playerHand);

        expect(playerHand.getTotalBetAmount()).toBe(8);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.BLACKJACK);
        player.addHand(playerHand);

        expect(playerHand.getTotalBetAmount()).toBe(5);
    });

    test('getBet', () => {
        expect(playerHand.getBet(Bets.NORMAL)).not.toBeNull();

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.BLACKJACK);
        player.addHand(playerHand);

        expect(playerHand.getBet(Bets.NORMAL)).toBeUndefined();
        expect(playerHand.getBet(Bets.BLACKJACK)).not.toBeNull();
    });

    test('getBets', () => {
        expect(playerHand.getBets().length).toBe(1);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.INSURANCE);
        playerHand.makeBet(player, Bets.DOUBLE);
        player.addHand(playerHand);

        expect(playerHand.getBets().length).toBe(2);
    });

    test('hasDoubleBet', () => {
        expect(playerHand.hasDoubleBet()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.INSURANCE);
        playerHand.makeBet(player, Bets.DOUBLE);
        player.addHand(playerHand);

        expect(playerHand.hasDoubleBet()).toBe(true);
    });

    test('canHitCard', () => {
        expect(playerHand.canHitCard()).toBe(true);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(card3);
        playerHand.addCard(card10);
        player.addHand(playerHand);

        expect(playerHand.canHitCard()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAD);
        player.addHand(playerHand);

        expect(playerHand.canHitCard()).toBe(false);
    });

    test('hasInsuranceBet', () => {
        expect(playerHand.hasInsuranceBet()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.INSURANCE);
        player.addHand(playerHand);

        expect(playerHand.hasInsuranceBet()).toBe(true);
    });

    test('canInsuranceBet', () => {
        expect(playerHand.canInsuranceBet(dealer)).toBe(false);

        dealer.resetHands();
        let dealerHand = new Hand();
        cardAC.setVisibility(true);
        dealerHand.addCard(cardAC);
        cardJ.setVisibility(false);
        dealerHand.addCard(cardJ);
        dealer.addHand(dealerHand);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.DOUBLE);
        playerHand.addCard(cardJ);
        playerHand.addCard(card2);
        player.addHand(playerHand);

        expect(playerHand.canInsuranceBet(dealer)).toBe(true);

        dealer.resetHands();
        dealerHand = new Hand();
        cardAC.setVisibility(false);
        dealerHand.addCard(cardAC);
        cardJ.setVisibility(true);
        dealerHand.addCard(cardJ);
        dealer.addHand(dealerHand);

        expect(playerHand.canInsuranceBet(dealer)).toBe(false);
    });

    test('canPlay', () => {
        expect(playerHand.canPlay()).toBe(true);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(card2);
        player.addHand(playerHand);

        expect(playerHand.canPlay()).toBe(true);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.DOUBLE);
        playerHand.addCard(cardJ);
        playerHand.addCard(card2);
        player.addHand(playerHand);

        expect(playerHand.canPlay()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAC);
        player.addHand(playerHand);

        expect(playerHand.canPlay()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAC);
        playerHand.addCard(cardAD);
        player.addHand(playerHand);

        expect(playerHand.canPlay()).toBe(true);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(card10);
        playerHand.addCard(cardAD);
        player.addHand(playerHand);

        expect(playerHand.canPlay()).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardJ);
        playerHand.addCard(cardAC);
        playerHand.addCard(cardAD);
        playerHand.addCard(card7);
        playerHand.addCard(card8);
        player.addHand(playerHand);

        expect(playerHand.canPlay()).toBe(false);
    });

    test('makeBet', () => {
        expect(playerHand.getBet(Bets.NORMAL)).not.toBeNull();

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.DOUBLE);
        player.addHand(playerHand);

        expect(playerHand.getBet(Bets.NORMAL)).toBeUndefined();
        expect(playerHand.getBet(Bets.DOUBLE)).not.toBeNull();

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.INSURANCE);
        player.addHand(playerHand);

        expect(playerHand.getBet(Bets.NORMAL)).not.toBeNull();
        expect(playerHand.getBet(Bets.INSURANCE)).not.toBeNull();

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.makeBet(player, Bets.BLACKJACK);
        player.addHand(playerHand);

        expect(playerHand.getBet(Bets.NORMAL)).toBeUndefined();
        expect(playerHand.getBet(Bets.BLACKJACK)).not.toBeNull();
    });

    test('isTie', () => {
        expect(playerHand.isTie(dealer)).toBe(false);

        dealer.resetHands();
        let dealerHand = new Hand();
        dealerHand.addCard(cardAC);
        dealerHand.addCard(cardJ);
        dealerHand.addCard(card10);
        dealerHand.addCard(card3);
        dealer.addHand(dealerHand);

        expect(playerHand.isTie(dealer)).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardAC);
        playerHand.addCard(cardJ);
        playerHand.addCard(card10);
        playerHand.addCard(card3);
        player.addHand(playerHand);

        expect(playerHand.isTie(dealer)).toBe(false);

        player.resetHands();
        playerHand = new Hand();
        playerHand.makeBet(player, Bets.NORMAL, 5);
        playerHand.addCard(cardAC);
        playerHand.addCard(cardJ);
        playerHand.addCard(card7);
        player.addHand(playerHand);

        dealer.resetHands();
        dealerHand = new Hand();
        dealerHand.addCard(card10);
        dealerHand.addCard(card3);
        dealerHand.addCard(card5);
        dealer.addHand(dealerHand);

        expect(playerHand.isTie(dealer)).toBe(true);
    });
});
