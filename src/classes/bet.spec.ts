import { Bets } from '../enums/bets.enum';
import { Bet } from './bet';

describe('Bet', () => {
    let bet;
    let amount = 10;

    describe('Normal Bet', () => {
        beforeEach(() => {
            bet = new Bet(Bets.NORMAL, amount);
        });

        test('getName', () => {
            expect(bet.getName()).toBe(Bets[Bets.NORMAL]);
        });

        test('getCostAmount', () => {
            expect(bet.getCostAmount()).toBe(10);
        });

        test('getTotalWinningAmount', () => {
            expect(bet.getTotalWinningAmount()).toBe(20);
        });

        test('getType', () => {
            expect(bet.getType()).toBe(Bets.NORMAL);
        });
    });

    describe('Double Bet', () => {
        beforeEach(() => {
            bet = new Bet(Bets.DOUBLE, amount);
        });

        test('getCostAmount', () => {
            expect(bet.getCostAmount()).toBe(20);
        });

        test('getTotalWinningAmount', () => {
            expect(bet.getTotalWinningAmount()).toBe(40);
        });
    });

    describe('Black Jack', () => {
        beforeEach(() => {
            bet = new Bet(Bets.BLACKJACK, amount);
        });

        test('getCostAmount', () => {
            expect(bet.getCostAmount()).toBe(10);
        });

        test('getTotalWinningAmount', () => {
            expect(bet.getTotalWinningAmount()).toBe(15);
        });
    });
});
