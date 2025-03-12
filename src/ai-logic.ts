import { Card, Hand, Game_state } from "./types";

import {random_num } from "./deck";

import {
    delete_card_from_hand, add_card_to_gp, draw_plus_2_or_4, display_hand,
    color_of_card, value_of_card, get_card_from_hand, matches_card_or_wild
} from "./game-comp";

import { head, is_null, List, tail } from "../lib/list";
import { matches_general } from "./main";

//here we make the algorithm for the AI/computer.

//displays all cards in an hand as an array of card tags(string)
export function AI_tags_in_arr(hand: Hand): Array<string> {
    return display_hand(hand);
}

/**
 * turns hand of cards to an array of cards.
 * @example
 * //returns [{ tag: 'green 8', CI: { color: 'green', value: 8 }]
 * const hand = {"green 8": list({ tag: 'green 8', CI: { color: 'green', value: 8 })};
 * hand_to_card_arr(hand);
 * @param hand the hand of cards to turn into an array of cards
 * @complexity theta(1) time complexity, linear in number of fields in hand
 * @returns an array of all cards in hand, including dupelicates
 */
export function hand_to_card_arr(hand: Hand): Array<Card> {
    const arr_lists = Object.values(hand)
    const result_arr: Array<Card> = [];
    let result_arr_index = 0;
     for(let i = 0; i < arr_lists.length; i++){
        let curr_lst: List<Card> = arr_lists[i];
        while(!is_null(curr_lst)){
            result_arr[result_arr_index] = head(curr_lst);
            curr_lst = tail(curr_lst);
            result_arr_index = result_arr_index + 1;
        }
     }
    return result_arr;
}


/**
 * from a hand, picks a card that matches current cards color, value or pick a wild card
 * @param hand hand to pick card from
 * @param current_card the card, whose color or value to match
 * @complexity theta(n) time complexity, step trough each element once in for loop
 * @returns an array of cards, if a card in hand matches current card
 * than array is nonempty, otherwise empty.
 */
export function AI_match_col_or_val(hand: Hand, current_card: Card): Array<Card> {
    const arr_of_cards: Array<Card> = hand_to_card_arr(hand);
    let res_card_arr: Array<Card> = []
    for(let i = 0; i < arr_of_cards.length; i++){
        if(matches_card_or_wild(arr_of_cards[i], current_card)){
            res_card_arr[0] = arr_of_cards[i];
            break;
        } else {}
    }
    return res_card_arr;
}
//returns true if ai can match current card, otherwise empty
export function can_ai_match(hand: Hand, current_card: Card): boolean {
    const arr_of_cards = AI_match_col_or_val(hand, current_card);
    return arr_of_cards[0] !== undefined;
}

/**
 * ai component to pick a matching card.
 * @param hand hand to pick card from
 * @param current_card card to match against
 * @precondition function may only be called inside game_loop by ai component
 * @complexity theta(n) time complexity, where n is number of fields in hand.
 * @returns a card that matches current_card
 */
export function ai_picked_card(hand: Hand, current_card: Card){
    const arr_of_cards = AI_match_col_or_val(hand, current_card);
    if(can_ai_match(hand, current_card) && arr_of_cards[0] !== undefined){
        return arr_of_cards[0];
    } else {
        throw new Error("ai cannot match card")
    }
}

/**
 * to handle the input of the ai in the game loop,
 * handles cases of the special card effects like new color, draw 4,
 * skip, reverse and applies them on opponent hand
 * @param game_state overall game state
 * @param ai_input the tag string which the ai has picked
 * @complexity theta(1) time complexity
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
            console.log("\nAi placed |wild +4|, player draw 4 cards and skip turn");
            game_state.current_color = random_col;
            console.log("\nNew color is: ", random_col);
            game_state.current_turn = "ai";

    } else if (color_of_card(ai_picked_card) === "wild" && value_of_card(ai_picked_card) === "new-color"){
            const random_num_ai = random_num(0, 3);
            const random_new_color = ["red", "green", "yellow", "blue"][random_num_ai];
            game_state.current_color = random_new_color;
            console.log("\nAi placed |wild new-color| card, new color is: ", random_new_color);
            game_state.current_turn = "player";

    } else if(value_of_card(ai_picked_card) === "+2" && (matches_card_or_wild(ai_picked_card, curr_card)
              || matches_general(game_state, ai_picked_card.tag, curr_card))){
            console.log(`\nAI placed |${ai_picked_card.tag}|, Player draws 2 and turn skipped\n`);
            draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.player_hand, ai_picked_card);
            game_state.current_color = color_of_card(ai_picked_card);
            game_state.current_turn = "ai";

    } else if((value_of_card(ai_picked_card) === "skip" || value_of_card(ai_picked_card) === "reverse")
               && (matches_card_or_wild(ai_picked_card, curr_card) || matches_general(game_state, ai_picked_card.tag, curr_card))){
            game_state.current_color = color_of_card(ai_picked_card);
            console.log(`\nAI placed |${ai_picked_card.tag}|, Player turn skipped\n`);
            game_state.current_turn = "ai";

    } else if((typeof value_of_card(ai_picked_card) === "number")
              && (matches_card_or_wild(ai_picked_card, curr_card)
                  || color_of_card(ai_picked_card) === game_state.current_color)) {
            game_state.current_color = color_of_card(ai_picked_card);
            console.log(`AI picks: |${ai_input}|`);
            game_state.current_turn = "player";
    } else {}

}
