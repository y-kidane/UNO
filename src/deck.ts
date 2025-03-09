import { Card, Color, Value, Deck} from "./types";
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
 * @returns a record with following properties:
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
 * creates all types of cards of one color and adds it to the queue
 * @param col the color to use to create the cards
 * @param q the queue to add all the cards to
 * @complexity Theta(1) time complexity, number of steps always the same
 * @returns a queue of cards where all cards have the color col.
 */
export function make_color(col: Color, q: Queue<Card> ): Queue<Card> {
    const p2 = "+2";
    const skip = "skip";
    const rev = "reverse";
    for(let i = 1; i < 10; i++) {
        const curr = make_card(col, i);
        many_enques(2, q, curr);
    }
    const p2_card = make_card(col, p2);
    many_enques(2, q, p2_card);
    const skip_card = make_card(col, skip);
    many_enques(2, q, skip_card);
    const rev_card = make_card(col, rev);
    many_enques(2, q, rev_card);
    enqueue(make_card(col, 0), q);
    return q;
}
/**
 * creates all the wild cards in UNO and adds them to the queue
 * @param q the queue to add the cards to
 * @complexity Theta(1) time complexity, number of steps always the same
 * @returns a queue where all wild cards have been added to the queue.
 */
export function make_wild_card(q: Queue<Card>): Queue<Card> {
    const col: Color = "wild";
    const take_4: Value = "+4";
    const pick_col: Value = "new-color";
    const made_4 = make_card(col, take_4);
    const made_pick_c = make_card(col, pick_col);
    many_enques(4, q, made_4);
    many_enques(4, q, made_pick_c);
    return q;
}
/**
 * generate random number in an interval, imported from lodash library.
 * @param min minimum allowed number
 * @param max maximum allowed number
 * @returns an integer in the range [min, max]
 */
export function random_num(min: number, max: number): number {
    //return Math.floor(Math.random() * (max - min + 1)) + min;
    return imported_random_gen(min, max, false);

}
//helper function: swaps place on 2 indexes in an array.
function swap<T>(A: Array<T>, i: number, j: number): void {
    const temp = A[i];
    A[i] = A[j];
    A[j] = temp;
}

/**
 * shuffles a queue in place, using Fisher Yates algorithm which
 * ensures that all elements have an equal chance to appear in any position.
 * @param q the queue to shuffle
 * @complexity Theta(n) time complexity, where n is the length of the queue.
 * @returns a queue with same elements but in randomized order.
 */
export function shuffle(q: Queue<Card>): Queue<Card>  {
    const q_arr = q[2];
    const begin = q[0];
    const end = q[1] - 1;
    for(let i = end; i >= begin; i--) {
        let j = random_num(begin, end);
        swap(q_arr, i, j);
    }
    q[2] = q_arr;//modify Q array.
    return q;
}
/**
 * creates a deck with all 108 UNO cards.
 * @complexity Theta(1) time complexity, always same number of steps
 * @returns a queue with all 108 cards where the cards
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

export function draw_card_from_deck(deck: Deck){
    const drawn_c = q_head(deck);
    dequeue(deck);
    return drawn_c;
}