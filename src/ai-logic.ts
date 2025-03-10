import { Card, Card_info, Hand, Color, Value, Deck, GamePile, Game_state } from "./types";

import { make_card, many_enques, make_color, make_wild_card, make_deck, shuffle, random_num } from "./deck";

import {
    delete_card_from_hand, add_card_to_hand, dist_cards, add_card_to_gp,
    current_top_card, draw_plus_2_or_4, length_of_hand, refill_deck_from_gp, display_hand, check_for_uno,
    color_of_card, value_of_card, get_card_from_hand, matches_card_or_wild,
} from "./game-comp";

import { empty as empty_q, head as q_head, dequeue } from "../lib/queue_array";

import { list, length as list_length, head, is_null, List, for_each, tail } from "../lib/list";

import { empty as empty_s } from "../lib/stack";


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
    let res_card_arr: Array<Card> = []
    for(let i = 0; i < arr_of_cards.length; i++){
        if(color_of_card(arr_of_cards[i]) === curr_col ||
           value_of_card(arr_of_cards[i]) === curr_val ||
           color_of_card(arr_of_cards[i]) === "wild") {
            res_card_arr[0] = arr_of_cards[i];
            break; //first matching card gets picked
        } else {}
    }
    return res_card_arr
}

export function can_ai_match(hand: Hand, current_card: Card): boolean {
    const arr_of_cards = AI_match_col_or_val(hand, current_card);
    return arr_of_cards.length > 0;
}

export function ai_picked_card(hand: Hand, current_card: Card){
    const arr_of_cards = AI_match_col_or_val(hand, current_card);
    if(can_ai_match(hand, current_card)){
        return arr_of_cards[0];
    } else {
        throw new Error("ai cannot match card")
    }
}

//function for picking color after placing wild card.
/**
 * to handle the input of the ai
 * @param game_state overall game state
 * @param ai_input the tag string which the ai has picked
 * @param curr_card the card to match with
 */

export function ai_make_play(game_state: Game_state, ai_input: string, curr_card: Card): void {
    const ai_picked_card = get_card_from_hand(ai_input, game_state.all_hands.ai_hand);
    game_state.game_pile = add_card_to_gp(ai_picked_card, game_state.game_pile);
    delete_card_from_hand(ai_picked_card, game_state.all_hands.ai_hand);

    if(color_of_card(ai_picked_card) === "wild" && value_of_card(ai_picked_card) === "+4"){
            draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.player_hand, ai_picked_card);
            const random_num_ai = random_num(0, 3);
            const random_col = ["red", "green", "yellow", "blue"][random_num_ai];
            console.log("\nAi placed |wild +4|, player draw 4 and skip turn");
            game_state.current_color = random_col;
            console.log("\nNew color is: ", random_col);
            game_state.current_turn = "ai";

    } else if (color_of_card(ai_picked_card) === "wild" && value_of_card(ai_picked_card) === "new-color"){
            const random_num_ai = random_num(0, 3);
            const random_col = ["red", "green", "yellow", "blue"][random_num_ai];
            game_state.current_color = random_col;
            console.log("\nAi placed |wild new-color| card, new color is: ", random_col);
            game_state.current_turn = "player";

    } else if(value_of_card(ai_picked_card) === "+2" && matches_card_or_wild(ai_picked_card, curr_card)){
            console.log(`\nAI placed |${ai_picked_card.tag}|, Player draws 2 and turn skipped\n`);
            draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.player_hand, ai_picked_card);
            game_state.current_color = color_of_card(ai_picked_card);
            game_state.current_turn = "ai";

    } else if((value_of_card(ai_picked_card) === "skip" || value_of_card(ai_picked_card) === "reverse")
               && matches_card_or_wild(ai_picked_card, curr_card)) {
            game_state.current_color = color_of_card(ai_picked_card);
            console.log(`\nAI placed |${ai_picked_card.tag}|, Player turn skipped\n`);
            game_state.current_turn = "ai";

    } else if(matches_card_or_wild(ai_picked_card, curr_card)) {
            game_state.current_color = color_of_card(ai_picked_card);
            console.log(`AI picks: |${ai_input}|`);
            game_state.current_turn = "player";
    } else {}

}
