import { is_null, head, list, tail, List, pair, append, for_each, length as list_length } from "./lib/list";
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
 * @complexity Theta(1) time complexity, all operations take constant time in the function
 * @returns true if card was deleted from hand, false otherwise
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
 * @param card the card to add to the hand
 * @param hand the hand to add the card to
 * @complexity Theta(1) time complexity, all operations take constant time in the function
 * 
 */
export function add_card_to_hand(card: Card, hand: Hand): void {
    const card_tag = card.tag;
    if(hand[card_tag] === undefined) {
        hand[card_tag] = list(card.CI);
    } else {
        hand[card_tag] = pair(card.CI, hand[card_tag]);
    }
}
/**
 * distribute n cards from a deck to a hand
 * @example
 * //results in false
 * dist_cards(empty_q<Card>(), {}, 4);
 * @param que the deck to draw the cards from
 * @param hand the hand to receive the cards
 * @param n how many cards to draw and add to hand
 * @complexity Theta(n) time complexity, where n is how many cards to draw.
 * @returns true if cards are distributed, false otherwise. 
 */

//if [head, next empty, arr], if n >=next empty 
export function dist_cards(que: Deck, hand: Hand, n: number): boolean {
    const first_elem_in_q = que[0];
    const last_elem_in_q = que[1];
    const cards_in_deck = last_elem_in_q - first_elem_in_q;
    if(n <= cards_in_deck) {
        for(let i = 0; i < n; i++) {
            const card_to_add = q_head(que);
            add_card_to_hand(card_to_add, hand);
            dequeue(que);
        }
        return true;
    } else {
        return false;
    }
}

/**
 * adds a card to the game pile 
 * @example
 * //results in list({ tag: 'red3', CI: { color: 'red', value: 3 } })
 * add_card_to_gp(make_card("red", 3), empty_s<Card>());
 * @param card the card to add to pile
 * @param game_pile the stack of the cards in the pile
 * @complexity Theta(1) time complexity
 * @returns a new stack where the added card is at the top of the stack and pile. 
 */
export function add_card_to_gp(card: Card, game_pile: GamePile): NonEmptyStack<Card> {
    const after_adding: NonEmptyStack<Card> = push(card, game_pile);
    return after_adding;
}
/**
 * returns the last played card in the game pile
 * @example
 * //results in { tag: 'red3', CI: { color: 'red', value: 3 } }
 * current_card(add_card_to_gp(make_card("red", 3), empty_s<Card>()));
 * @param gp the game pile which is a stack
 * @complexity Theta(1) time complexity
 * @returns the card on top of the stack, last played card
 */
export function current_card(gp: GamePile): Card | boolean {
    if (!is_empty_s(gp)) {
        return top(gp);
    } else {
        return false;
    }
}
/**
 * draws cards from deck and adds them to a hand based on the value of a card
 * @example
 * //results in true
 * draw_plus(make_deck(), {}, {tag: 'red+2', CI: { color: 'red', value: '+2' }})
 * 
 * //results in false
 * draw_plus(make_deck(), {}, {tag: 'blue4', CI: { color: 'blue', value: '4' }})
 * @param deck the deck to draw cards from
 * @param hand the hand to receive the drawn cards
 * @param val the card that decides how many cards to draw
 * @returns true if cards were drawn and added to hand, false otherwise.
 */
export function draw_plus(deck: Queue<Card>, hand: Hand, val: Card): boolean {
    const how_much_draw: Value = val.CI.value;
    if(how_much_draw === "+2") {
       return dist_cards(deck, hand, 2);  
    }
    else if(how_much_draw === "+4") {
        return dist_cards(deck, hand, 4); 
    } else {
        return false;
    }
}
/**
 * returns how many cards there are in one hand
 * @example
 * //results in 2
 * length_of_hand({ red4: list({ color: 'red', value: 4 }, { color: 'red', value: 4 })})
 * @param hand is the hand to count the cards of
 * @returns a number, how many cards there is in the hand
 */
export function length_of_hand(hand: Hand): number {
    const keys = Object.keys(hand);
    const key_len = keys.length;
    let count = 0;
    for(let i = 0; i < key_len; i++) {
        count = count + list_length(hand[keys[i]])
    }
    return count;
}

