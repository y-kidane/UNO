import { Card, Card_info, Hand, Color, Value, Deck, GamePile } from "./types";

import { make_card, many_enques, make_color, make_wild_card, make_deck, shuffle, random_num } from "./deck";

import { 
    delete_card_from_hand, add_card_to_hand, dist_cards, add_card_to_gp, 
    current_card, draw_plus_2_or_4, length_of_hand, refill_deck_from_gp, display_hand, check_for_uno,
    color_of_card,
    value_of_card
} from "./game";

import { empty as empty_q, head as q_head, dequeue } from "./lib/queue_array";

import { list, length as list_length, head, is_null, List, for_each, tail } from "./lib/list";

import { empty as empty_s } from "./lib/stack";


//here we make the algo for the AI/computer (vs player)

/**
 * 
 * main work:
 * 
 * turn hands of ai to an array of cards, and iterate over all cards CI, and do an if check
 * if(color or value matches current card) => place that card directly and change turn
 * if none of the cards match, check for wild cards and place them and change turn to player
 * if player gives draw to ai, just mod ai hand as normal
 * len of hand and check for UNO will be done in main game loop check
 * 
 * 
 * 
 * 
 * 
 */

export function AI_tags_in_arr(hand: Hand) {
    return display_hand(hand);
}

/**
 * turns hand of cards to array of cards.
 * @example
 * //returns [{ tag: 'green 8', CI: { color: 'green', value: 8 }]
 * const hand = {"green 8": list({ tag: 'green 8', CI: { color: 'green', value: 8 })};
 * hand_to_card_arr(hand);
 * @param hand the hand to turn into an array
 * @returns an array of all cards in hand, including dupelicates
 */
export function hand_to_card_arr(hand: Hand): Array<Card> {
    const arr_lists = Object.values(hand)
    const result_arr: Array<Card> = [];
    let indx_res = 0;
    //have arr of card lists List<Card> turns to arr[Card]
     for(let i = 0; i < arr_lists.length; i++){
        let curr_lst = arr_lists[i];
        while(!is_null(curr_lst)){
            result_arr[indx_res] = head(curr_lst);
            curr_lst = tail(curr_lst);
            indx_res = indx_res + 1;
        }
     }
    return result_arr;
}


/**
 * from a hand, picks a card that matches current cards color, value or pick a wild card
 * @param hand hand to pick card from
 * @param current_card the card, whose color or value to match
 * @returns an array of cards, if a card was picked than array is nonempty, otherwise empty
 */
export function AI_match_col_or_val(hand: Hand, current_card: Card): Array<Card> {
    const arr_of_cards: Card[] = hand_to_card_arr(hand);
    const curr_val: Value = current_card.CI.value;
    const curr_col: Color = current_card.CI.color;
    let result_card_or_bool: Array<Card> = [] 
    for(let i = 0; i < arr_of_cards.length; i++){
        if(color_of_card(arr_of_cards[i]) === curr_col || 
           value_of_card(arr_of_cards[i]) === curr_val ||
           color_of_card(arr_of_cards[i]) === "wild") {
            result_card_or_bool[0] = arr_of_cards[i];
            break; //first matching card gets picked
        } else {}
    }
    return result_card_or_bool
}
