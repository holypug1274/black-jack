import { Hand } from './hand';

export abstract class AbstractPlayer {
    private name: string;
    private hands: Hand[] = [];

    constructor(name: string) {
        this.name = name.length > 6 ? name.slice(0, 6) : name;
    }

    public resetHands(): void {
        this.hands = [];
    }

    public getName(): string {
        return this.name.toUpperCase();
    }

    public addHand(hand: Hand): void {
        this.hands.push(hand);
    }

    public getHands(): Hand[] {
        return this.hands;
    }

    public getHand(): Hand {
        return this.hands[0];
    }
}
