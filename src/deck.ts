import { Card, Color, Value, Deck } from "./types";
import { Queue, dequeue, empty as empty_q, enqueue, head as q_head } from "../lib/queue_array";
import { random as imported_random_gen } from 'lodash';


/**
 * Creates a record that represents a Card
 * @example
 * //results in {tag: "red 7", CI: {color: red, value: 7}}
 * make_card("red", 7);
 * @param col the color of a UNO card
 * @param val the value of a UNO card
 * @complexity Theta(1) time complexity, regardless of color or value
 * @returns a record with following fields:
 * - tag: a string which is a concatenation of the color and value of a card.
 * - CI: a record containing the color and value of a UNO card.
 */
export function make_card(col: Color, val: Value): Card {
    return {
        tag: `${col} ${val}`,
        CI: {color: col, value: val}
    };
}

//enqueue an element n times, Theta(n) complexity where n is number of enqueues.
export function many_enques<T>(n: number, q: Queue<T>, e: T): Queue<T> {
    for(let j = 0; j < n; j++) {
        enqueue(e, q);
    }
    return q;
}

/**
 * creates all types of standard UNO cards of one color and adds it to a deck
 * UNO has: one 0, two cards of each number in 1-9, two skips and reverses
 * from one standard UNO color
 * @param col the color to use to create the cards
 * @param deck the deck to add all the cards to
 * @complexity Theta(1) time complexity, number of steps always the same
 * @returns a deck of UNO cards where all cards have the color col
 * and one of the values: number, +2, skip or reverse.
 */
export function make_color(col: Color, deck: Deck ): Deck {
    const p2 = "+2";
    const skip = "skip";
    const rev = "reverse";
    for(let i = 1; i < 10; i++) {
        const curr = make_card(col, i);
        many_enques(2, deck, curr);
    }
    const p2_card = make_card(col, p2);
    many_enques(2, deck, p2_card);
    const skip_card = make_card(col, skip);
    many_enques(2, deck, skip_card);
    const rev_card = make_card(col, rev);
    many_enques(2, deck, rev_card);
    enqueue(make_card(col, 0), deck);
    return deck;
}
/**
 * creates all the wild cards in UNO and adds them to the deck
 * @param deck the deck to add the cards to
 * @complexity Theta(1) time complexity, number of steps always the same
 * @returns a deck where all wild cards have been added to the deck.
 */
export function make_wild_card(deck: Deck): Deck {
    const col: Color = "wild";
    const take_4: Value = "+4";
    const pick_col: Value = "new-color";
    const made_4 = make_card(col, take_4);
    const made_pick_c = make_card(col, pick_col);
    many_enques(4, deck, made_4);
    many_enques(4, deck, made_pick_c);
    return deck;
}
/**
 * generate random number in an interval, imported from lodash library.
 * @param min minimum allowed number
 * @param max maximum allowed number
 * @returns an integer in the range [min, max]
 */
export function random_num(min: number, max: number): number {
    return imported_random_gen(min, max, false);

}

//helper function: swaps place on 2 indexes in an array.
function swap<T>(A: Array<T>, i: number, j: number): void {
    const temp = A[i];
    A[i] = A[j];
    A[j] = temp;
}

/**
 * shuffles a deck array in place, using Fisher Yates algorithm which
 * ensures that all elements have an equal chance to appear in any position.
 * @param deck the deck to shuffle
 * @complexity Theta(n) time complexity, where n is the number of cards in deck.
 * @returns a deck with same cards but in randomized order.
 */
export function shuffle(deck: Deck): Deck {
    const deck_arr = deck[2];
    const begin = deck[0];
    const end = deck[1] - 1;
    for(let i = end; i >= begin; i--) {
        let j = random_num(begin, end);
        swap(deck_arr, i, j);
    }
    return deck;
}
/**
 * creates a deck with all 108 UNO cards.
 * @complexity Theta(1) time complexity, always same number of steps
 * @returns a deck with all 108 cards where the cards
 * are shuffled and in randomized order.
 */
export function make_deck(): Deck {
    const deck_q: Deck = empty_q();
    make_color("red", deck_q);
    make_color("yellow", deck_q);
    make_color("green", deck_q);
    make_color("blue", deck_q);
    make_wild_card(deck_q)
    shuffle(deck_q);
    return deck_q;
}

/**
 * draw one card from a deck
 * @param deck the deck to draw card from
 * @precondition deck may not be empty
 * @complexity theta(1) time complexity
 * @returns returns a card from deck
 */
export function draw_card_from_deck(deck: Deck): Card {
    const drawn_c = q_head(deck);
    dequeue(deck);
    return drawn_c;
}