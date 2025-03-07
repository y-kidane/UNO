import { is_null, head, list, tail, List, pair, append, for_each, length as list_length } from "../lib/list";
import { Card, Color, Value, Card_info, Hand, Deck, GamePile, Mult_hands } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q,
    enqueue, dequeue, head as q_head, display_queue } from "../lib/queue_array";
import { pop, top, Stack, NonEmptyStack, empty as empty_s,
    is_empty as is_empty_s, push,  } from "../lib/stack";
import { make_deck, make_card, shuffle } from "./deck";
import * as promptSync from 'prompt-sync';
import { split } from "lodash";
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
        hand[card_tag] = list(card);
    } else {
        hand[card_tag] = pair(card, hand[card_tag]);
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
            const card_to_add: Card = q_head(que);
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
 * @returns the card on top of the stack, last played card.
 * returns false if game pile is empty.
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
export function draw_plus_2_or_4(deck: Queue<Card>, hand: Hand, val: Card): boolean {
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

//selector, returns value of a card
export function value_of_card(card: Card): Value {
    return card.CI.value;
}
//selector, return color of a card.
export function color_of_card(card: Card): Color {
    return card.CI.color;
}
//selector, returns tag of a card
export function tag_of_card(card: Card): string {
    return card.tag;
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

/**
 * move all cards from game pile, except the top card, and inserts into deck.
 * @param game_pile the stack of cards to move cards from
 * @param game_deck the deck of cards to add cards to
 * @returns a new game pile with only the last added card on top.
 */
export function refill_deck_from_gp(game_pile: GamePile, game_deck: Deck): GamePile {
    let result_pile: GamePile = empty_s<Card>();
    if(is_empty_s(game_pile)) {
        return result_pile;
    } else {
        result_pile = push(top(game_pile), result_pile);
        let loop_pile = pop(game_pile);
        while(!is_empty_s(loop_pile)){
            enqueue(top(loop_pile), game_deck);
            loop_pile = pop(loop_pile);
        }
        shuffle(game_deck);
        return result_pile;
    }
}

/**
 * displays all cards tags from a hand, each tag represents a card in hand
 * @example
 * //results in ["blue 7", "yellow 5", "yellow 5"]
 * const hand: Hand = {};
 * add_card_to_hand(make_card("blue", 7), handx);
 * add_card_to_hand(make_card("yellow", 5), handx);
 * add_card_to_hand(make_card("yellow", 5), handx);
 * display_hand(hand);
 * @param hand is the hand to display the cards for
 * @returns an array where each element is tag
 */

export function display_hand(hand: Hand): Array<string> {
    const keys_in_hand: Array<string> = Object.keys(hand);
    const result_arr: Array<string> = [];
    let len_tag_index = 0;
    for(let i = 0; i < keys_in_hand.length; i++){
        const current_tag: string = keys_in_hand[i];
        const list_len_key: number = list_length(hand[keys_in_hand[i]]);
        for(let j = 0; j < list_len_key; j++){
            result_arr[len_tag_index] = current_tag;
            len_tag_index = len_tag_index + 1;
        }
    }
    return result_arr;
}

/**
 * checks if a player has UNO, which is a hand of length 1.
 * @param hand the hand to check for UNO
 * @returns true iff player has UNO, false otherwise
 */

export function check_for_uno(hand: Hand): Boolean {
    return length_of_hand(hand) === 1
           ? true
           : false;
}

/**
 * checks if a hand has won, meaning check if length of hand is 0
 * @param hand is the hand to check if it has won
 * @returns true iff length of hand is 0, false otherwise.
 */

export function is_winning(hand: Hand): boolean {
    return length_of_hand(hand) === 0
           ? true
           : false;
}

//check if value should be a number or one of the other values
function num_or_draw_card(str: string): string | number {
    return str.length > 1 //only ints have string len 1
           ? str
           : Number(str);
}

/**
 * validate an input string by checking of components match Color or Value
 * @example
 * //results in true
 * is_valid_input("yellow         +2")
 * @param input the string to validate
 * @returns true iff input is a valid UNO card, false otherwise
 * //can't test input and prompt in jest, but this code does work.
 */

export function is_valid_input(input: string): boolean {
    const valid_colors = ["red", "yellow", "blue", "green", "wild"];
    const valid_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+4", "+2", "new-color", "skip", "reverse"];
    const split_input = input.split(/\s+/); //split between all space,
    if(split_input.length < 2){
        return false;
    } else {}
    const col = split_input[0];
    const val = num_or_draw_card(split_input[1]);

    return valid_colors.includes(col) && valid_values.includes(val);
}

/**
 * prints welcome message and asks if user wants to play
 * @returns true if input is "y", false if "n", loop otherwise
 */
function welcome_screen(): boolean {
    const prompt = promptSync();
    console.log("Welcome to UNO. Would you like to play a game against the AI? [y/n] ");
    while(true){
        const user_input_start = prompt("Answer: ");
        if(user_input_start === "y"){
            return true;
        } else if(user_input_start === "n"){
            return false;
        } else{
            console.log("invalid input, try again");
        }
    }
}


function game_run() {
    const all_hands: Mult_hands = {ai_hand: {}, player_hand: {}};
    
}
