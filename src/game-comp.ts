import { is_null, head, list, tail, pair, length as list_length } from "../lib/list";

import { Card, Color, Value, Hand, Deck, GamePile, Mult_hands, Game_state } from "./types";

import { Queue, enqueue, dequeue, head as q_head, is_empty as is_empty_q } from "../lib/queue_array";

import { pop, top, NonEmptyStack, empty as empty_s, is_empty as is_empty_s, push,  } from "../lib/stack";

import { shuffle, draw_card_from_deck } from "./deck";


/**
 * displays all cards tags from a hand, each tag represents a card in hand
 * @example
 * //results in ["blue 7", "yellow 5", "yellow 5"]
 * const hand: Hand = {};
 * add_card_to_hand(make_card("blue", 7), hand);
 * add_card_to_hand(make_card("yellow", 5), hand);
 * add_card_to_hand(make_card("yellow", 5), hand);
 * display_hand(hand);
 * @param hand is the hand to display the cards for
 * @complexity theta(n) time complexity where n is number of fields in hand.
 * @returns an array where each element is a tag
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
 * checks if a card is in a hand.
 * @param hand the hand to check in
 * @param tag the tag for the card to look for in hand
 * @complexity theta(n) where n is number of fields in hand
 * @returns true iff card is in hand, false otherwise.
 */

export function is_card_in_hand(hand: Hand, tag: string): boolean {
    return display_hand(hand).includes(tag);
}

/**
 * checks if the card to place matches
 * the match card or if it is a wild card
 * @param c_to_place the card to check
 * @param c_to_match the card to check against for match
 * @returns true iff the color or value matches the match card, or if the color is wild.
 * false otherwise.
 */

export function matches_card_or_wild(c_to_place: Card, c_to_match: Card): boolean{
    return (color_of_card(c_to_place) === color_of_card(c_to_match)) ||
           (value_of_card(c_to_place) === value_of_card(c_to_match)) ||
           (color_of_card(c_to_place) === "wild");
}

/**
 * removes a card from a hand, and removed the cards field fully
 * from hand if there is only one of that card before deleting
 * @example
 * //results in true
 * delete_card_from_hand({ tag: 'red 5', CI: { color: 'red', value: 5 }},
 *                       { 'red 4' : list({ color: 'red', value: 5 },
 *                                        { color: 'red', value: 5 })});
 * //results in false
 * delete_card_from_hand({ tag: 'blue9', CI: { color: 'blue', value: 9 }}, {})
 * @param card the card to remove from the hand
 * @param hand the record which represents the hand
 * @complexity Theta(1) time complexity
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
 * retrives card from a hand
 * @param tag the tag of the card to get
 * @param hand the hand to get card from
 * @precondition the card represented by tag must be in hand
 * @complexity theta(1) time complexity
 * @returns the retreived card from hand
 */

export function get_card_from_hand(tag: string, hand: Hand) {
    if(!is_null(hand[tag])){
        return head(hand[tag]);
    } else {
        throw new Error("card not in hand!");
    }
}

/**
 * adds a card to a hand
 * @param card the card to add to the hand
 * @param hand the hand to add the card to
 * @complexity Theta(1) time complexity, all operations take constant time in the function
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
 * @param deck the deck to draw the cards from
 * @param hand the hand to receive the cards
 * @param n how many cards to add to hand from deck
 * @complexity Theta(n) time complexity, where n is how many cards to draw.
 * @returns true if cards are distributed, false otherwise.
 */

export function dist_cards(deck: Deck, hand: Hand, n: number): boolean {
    const first_elem_in_q = deck[0];
    const last_elem_in_q = deck[1];
    const cards_in_deck = last_elem_in_q - first_elem_in_q;
    if(n <= cards_in_deck) {
        for(let i = 0; i < n; i++) {
            const card_to_add: Card = q_head(deck);
            add_card_to_hand(card_to_add, hand);
            dequeue(deck);
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
 * add_card_to_gp(make_card("red", 3), make_gp());
 * @param card the card to add to pile
 * @param game_pile the stack of the cards in the pile
 * @complexity Theta(1) time complexity
 * @returns a new stack where the added card is at the top of the stack.
 */

export function add_card_to_gp(card: Card, game_pile: GamePile): GamePile {
    const after_adding: NonEmptyStack<Card> = push(card, game_pile);
    return after_adding;
}

/**
 * returns the last played card in the game pile
 * @example
 * //results in { tag: 'red3', CI: { color: 'red', value: 3 } }
 * current_card(add_card_to_gp(make_card("red", 3), make_gp()));
 * @param gp the game pile which is a stack
 * @complexity Theta(1) time complexity
 * @precondition the game pile may not be empty.
 * @returns the card on top of the stack, last played card.
 */

export function current_top_card(gp: GamePile): Card  {
    if (!is_empty_s(gp)) {
        return top(gp);
    } else {
        throw new Error("cannot take top from empty stack");
    }
}

//makes an empty game pile
export function make_gp(): GamePile {
    return empty_s<Card>();
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
 * @param what_draw_card the card that decides how many cards to draw
 * @complexity theta(1) time complexity
 * @returns true if cards were drawn and added to hand, false otherwise.
 */
export function draw_plus_2_or_4(deck: Queue<Card>, hand: Hand, what_draw_card: Card): boolean {
    const how_much_draw: Value = what_draw_card.CI.value;
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

/**
 * returns how many cards there are in one hand
 * @example
 * //results in 2
 * length_of_hand({ red4: list({ color: 'red', value: 4 }, { color: 'red', value: 4 })})
 * @param hand is the hand to count the cards of
 * @complexity theta(n) linear time complexity, is is number of cards in hand
 * @returns a number, how many cards there is in the hand
 */
export function length_of_hand(hand: Hand): number {
    return display_hand(hand).length;
}

/**
 * move all cards from game pile, except the top card, and inserts into deck.
 * @param game_pile the stack of cards to move cards from
 * @param game_deck the deck of cards to add cards to
 * @precondition gamepile may not be empty
 * @complecity theta(n) time complexity, n is number of cards in gamepile
 * @returns a new game pile with only the last added card on top.
 */
export function refill_deck_from_gp(game_pile: GamePile, game_deck: Deck): GamePile {
    let result_pile: GamePile = make_gp();
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
 * checks if a player has UNO, which is a hand of length 1.
 * @param hand the hand to check for UNO
 * @complexity theta(n) time complexity where n is number of cards in hand
 * @returns true iff player has UNO, false otherwise
 */

export function check_for_uno(hand: Hand): Boolean {
    return length_of_hand(hand) === 1;

}

/**
 * checks if a hand has won, meaning check if length of hand is 0
 * @param hand is the hand to check if it has won
 * @complexity theta(n) time complexity where n is number of cards in hand
 * @returns true iff length of hand is 0, false otherwise.
 */

export function is_winning(hand: Hand): boolean {
    return length_of_hand(hand) === 0;
}

//helper, check if value should be a number or one of the other values.
export function is_val_num_or_str(str: string): string | number {
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
 * @complexity theta(1) time complexity
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
    const val = is_val_num_or_str(split_input[1]);

    return valid_colors.includes(col) && valid_values.includes(val);
}

/**
 * distributes 7 cards each to each hand in all_hands
 * @param hands a record containing hands
 * @precondition deck must be nonempty
 * @complexity theta(1) time complexity
 * @param deck the deck to pick cards from
 */

export function start_of_game_dist(all_hands: Mult_hands, deck: Deck): void {
    dist_cards(deck, all_hands.player_hand, 7);
    dist_cards(deck, all_hands.ai_hand, 7);
}

/**
 * picks a card with number value from deck and adds to gamepile
 * @param gp the current gamepile
 * @param deck the deck to pick cards from
 * @precondition deck must contain number cards
 * @returns a game pile where last placed card is a number card.
 */
export function starting_game_pile(gp: GamePile, deck: Deck): GamePile {
    while(true){
        if(is_empty_q(deck)){
            gp = refill_deck_from_gp(gp, deck);
            if(is_empty_q(deck)){
                throw new Error("Cannot draw cards if deck and game pile is empty");
                //to handle infinite looping issue, but won't happen in UNO game
            } else {}
        } else {
            const drawn_card = draw_card_from_deck(deck);
            gp = add_card_to_gp(drawn_card, gp);
            if(typeof value_of_card(drawn_card) === "number"){
                return gp;
            } else {}
        }
    }
}
