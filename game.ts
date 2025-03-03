import { is_null, head, list, tail, List, pair, append } from "./lib/list";
import { Card, Color, Value, Card_info, Hand, Deck, GamePile } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q, 
    enqueue, dequeue, head as q_head, display_queue } from "./lib/queue_array";
import { pop, top, Stack, NonEmptyStack, empty as empty_s, 
    is_empty as is_empty_s, push,  } from "./lib/stack";
import { make_deck, make_card } from "./deck";

//here we make the main game logic, this is the file to run to play the game. 
/**
 * removes a card from a hand
 * @example
 * //results in true
 * delete_card_from_hand({ tag: 'red5', CI: { color: 'red', value: 5 }}, 
 *                       { red4: list({ color: 'red', value: 5 }, 
 *                                    { color: 'red', value: 5 })});
 * //results in false
 * delete_card_from_hand({ tag: 'blue9', CI: { color: 'blue', value: 9 }}, {})
 * @param card the card to remove from the hand
 * @param hand the record which represents the hand
 * @complexity Theta(1), all operations take constant time in the function
 * @returns the hand, containing all cards except for the removed card.
 */
export function delete_card_from_hand(card: Card, hand: Hand): boolean {
    const card_tag = card.tag;
    if(hand[card_tag] && !is_null(hand[card_tag])) {
        hand[card_tag] = tail(hand[card_tag]);
        if(is_null(hand[card_tag])) {
            delete hand[card_tag];
        } else {}
        return true;
    } else {
        return false;
    }
}
/**
 * adds a card to a hand
 * @param c the card to add to the hand
 * @param hand the hand to add the card to
 * @complexity Theta(1), all operations take constant time in the function
 * 
 */
export function add_card_to_hand(c: Card, hand: Hand): void {
    const card_tag = c.tag;
    if(hand[card_tag] === undefined) {
        hand[card_tag] = list(c.CI);
    } else {
        hand[card_tag] = pair(c.CI, hand[card_tag]);
    }
}
/**
 * distribute n cards from a deck to  to a hand
 * @example
 * //results in false
 * dist_cards(empty_q<Card>(), {}, 4);
 * @param q the deck to draw the cards from
 * @param hand the hand to receive the cards
 * @param n how many cards to draq and add to hand
 * @complexity Theta(n), where n is how many cards to draw.
 * @returns true if cards are distributed, false otherwise. 
 */
export function dist_cards(q: Deck, hand: Hand, n: number): boolean {
    const deck_l = q[2].length;
    if(n > deck_l) {
        return false;
    } else {
        for(let i = 0; i < n; i++) {
            const card_to_add = q_head(q);
            add_card_to_hand(card_to_add, hand);
            dequeue(q);
        }
        return true;
    }
}

//we need to return new game pile after every application
/**
 * adds a card to the game pile 
 * @param c the card to add to pile
 * @param game_pile the stack of the cards in the pile
 * @returns a new stack where the added card is at the top of the stack and pile. 
 */
export function add_card_to_gp(c: Card, game_pile: GamePile) {
    const after_adding: NonEmptyStack<Card> = push(c, game_pile);
    return after_adding;
}

export function current_card(gp: NonEmptyStack<Card>): Card {
    return top(gp);
}

export function draw_plus(deck: Queue<Card>, hand: Hand, val: Card): void {
    const how_much_draw = val.CI.value;

    if(how_much_draw === "+2") {
        for(let i = 0; i < 2; i++) {
            add_card_to_hand(q_head(deck), hand);
            dequeue(deck);
        }
    }
    else if(how_much_draw === "+4") {
        for(let i = 0; i < 4; i++) {
            add_card_to_hand(q_head(deck), hand);
            dequeue(deck);
        }
    } else {}
}


// draw_plus(test_deck, phand, make_card("green", "+4"));

// console.log(phand);

//
// const dex = make_deck();
// const dex_arr = dex[2];
// for(let i = 0; i < dex_arr.length; i++) {
//     console.log(dex_arr[i]);
// }
