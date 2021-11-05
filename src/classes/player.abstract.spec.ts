import { Hand } from './hand';
import { AbstractPlayer } from './player.abstract';

class FakePlayer extends AbstractPlayer {}

describe('AbstractPLayer', () => {
    let player: FakePlayer;

    beforeEach(() => {
        player = new FakePlayer('Levi');
    });

    test('getName', () => {
        expect(player.getName()).toBe('Levi'.toUpperCase());
    });

    test('addHand', () => {
        player.addHand(new Hand());
        expect(player.getHands().length).toBe(1);
    });

    test('resetHand', () => {
        player.addHand(new Hand());
        player.resetHands();
        expect(player.getHands().length).toBe(0);
    });

    test('getHand', () => {
        player.addHand(new Hand());
        expect(player.getHand()).toBeTruthy();
    });
});
