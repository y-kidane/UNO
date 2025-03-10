import { Card, Card_info, Hand, Color, Value, Deck, GamePile, Mult_hands, Game_state } from "./types";

import { make_card, many_enques, make_color, make_wild_card, make_deck, shuffle, random_num } from "./deck";

import { empty as empty_q, head as q_head, dequeue, is_empty as is_empty_q } from "../lib/queue_array";

import { list, length as list_length, head, is_null } from "../lib/list";

import { empty as empty_s } from "../lib/stack";

import { AI_tags_in_arr, hand_to_card_arr, AI_match_col_or_val,
        ai_make_play, ai_picked_card, can_ai_match } from "./ai-logic";

import {
    refill_deck_from_gp, draw_card_from_deck, is_card_in_hand,
    is_valid_input, is_winning, delete_card_from_hand,
    add_card_to_gp, start_of_game_dist, display_hand, dist_cards,
    draw_plus_2_or_4, add_card_to_hand, get_card_from_hand, check_for_uno,
    color_of_card, value_of_card, current_top_card,
    make_gp, length_of_hand, is_val_num_or_str,
    game_conditional, next_person_turn, matches_card_or_wild,
    } from "./game-comp";

import PromptSync = require ("prompt-sync");
const prompt: PromptSync.Prompt = PromptSync({sigint:true});

/**
 * prints welcome message and asks if user wants to play
 * @returns true if input is "y", false if "n", loop otherwise
 */
function welcome_screen(): boolean {
    console.log("\nWelcome to UNO. Would you like to play a game against the AI? [y/n]\n ");
    while(true){
        const user_input_start = prompt("Answer: ");
        if(user_input_start === "y"){
            return true;
        } else if(user_input_start === "n"){
            console.log("No worries, have a good day!")
            return false;
        } else{
            console.log("invalid input, try again\n");
        }
    }
}

/**
 * picks a card with number type value from deck, adds to gamepile
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
                //to handle infinite looping issue, but won't happen in UNO
            } else {}

        } else {
            const drawn_card: Card = q_head(deck);
            dequeue(deck);
            gp = add_card_to_gp(drawn_card, gp);
            if(typeof value_of_card(drawn_card) === "number"){
                return gp;
            }
        }
    }
}

/**
 * a help interface for player
 * @param game_state the overall state of the game
 * @param player_input the input string
 * @param curr_card is the card to match against
 */
export function help_ops_for_player(game_state: Game_state, player_input: string, curr_card: Card): void{
    if(player_input === "display") {
        console.log(display_hand(game_state.all_hands.player_hand));
    } else if(player_input === "quit"){
        game_state.is_game_over = true;
    } else if(player_input === "no card"){
        draw_another(game_state, curr_card);
    } else if (player_input === "help"){
        console.log("\nTo view your cards enter: display");
        console.log("if you have no matching card enter: no card");
        console.log("To see the current color enter: color");
        console.log("to view help commands again enter: help\n");
        console.log("To quit game enter: quit");
    } else if(player_input === "color"){
        console.log("current color: ", game_state.current_color);
    } else {
        console.log("\ninvalid input, either enter a card or enter help to view commands\n")
    }
}


/**
 * handles picking new color after wild card.
 * @returns the inputed string from the prompt, which is the new color
 */

export function pick_new_color_wild(game_state: Game_state): string  {
    const valid_colors = ["red", "green", "yellow", "blue"];
    console.log("Wild card!")
    while(true){
        const player_col_pick = prompt("Pick a new color: ");
        if(valid_colors.includes(player_col_pick)){
            console.log(`\nNew color is: ${player_col_pick}\n`);
            return player_col_pick;
        } else {
            console.log(`Invalid color, allowed colors are: ${valid_colors}\n`);
        }
    }
}
// else if (player_col_pick === "quit") {
//     game_state.is_game_over = true;
//     break;

function game_rule() {
    console.log("\nHow to play: \n");
    console.log("The goal of the game is to get rid of all your cards before the computer");
    console.log("\n- To place a card: enter the color and value of the chosen card.");
    console.log("- example: 'red 7' or 'wild +4' or 'yellow skip");
    console.log("- To see your hand of UNO cards enter: display");
    console.log("- if you dont have a matching card enter: no card");
    console.log("- to quit the game enter: quit");
    console.log("\nGood luck\n");
}

export function matches_general(game_state: Game_state, pl_input: string, curr_card: Card){
    const comp_card: Card = get_card_from_hand(pl_input, game_state.all_hands.player_hand);
    return matches_card_or_wild(comp_card, curr_card) || color_of_card(comp_card) === game_state.current_color;
}

/**
 * handling player inputs and executing card effects
 * @param game_state overall state of the game
 * @param player_input players input string, card or invalid.
 * @param curr_card card to match against
 */
export function player_make_play(game_state: Game_state, player_input: string, curr_card: Card): void {

    if(is_valid_input(player_input)
        && is_card_in_hand(game_state.all_hands.player_hand, player_input)
        && matches_general(game_state, player_input, curr_card)) {

        const picked_card: Card = get_card_from_hand(player_input, game_state.all_hands.player_hand);
        game_state.game_pile = add_card_to_gp(picked_card, game_state.game_pile);
        delete_card_from_hand(picked_card, game_state.all_hands.player_hand);

        if(color_of_card(picked_card) === "wild" && value_of_card(picked_card) === "+4"){
                const new_col = pick_new_color_wild(game_state);
                game_state.current_color = new_col;
                draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.ai_hand, picked_card);
                console.log("\nai draws 4\n");
                console.log("\nPlayer turn again!\n")
                game_state.current_turn = "player";

        } else if (color_of_card(picked_card) === "wild" && value_of_card(picked_card) === "new-color"){
                const new_col1 = pick_new_color_wild(game_state);
                game_state.current_color = new_col1;
                game_state.current_turn = "ai";

        } else if(value_of_card(picked_card) === "+2" && matches_card_or_wild(picked_card, curr_card)){
                console.log("\nAI gets to draw 2 and skip turn\n")
                draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.ai_hand, picked_card);
                game_state.current_turn = "player";

        } else if((value_of_card(picked_card) === "skip" || value_of_card(picked_card) === "reverse")
                       && matches_card_or_wild(picked_card, curr_card)) {
                console.log("\nAI turn skipped\n");
                game_state.current_turn = "player";

        } else if(typeof value_of_card(picked_card) === "number" && matches_card_or_wild(picked_card, curr_card)) {
                game_state.current_turn = "ai";
        } else {}

    } else {
            console.log("\nInvalid choice\n");
            draw_another(game_state, curr_card);
    }
}

/**
 * asks if player wants to draw card, and plays the card if it matches current card.
 * @param gs the overall state of the game
 * @param curr_card the card to match against
 */
export function draw_another(gs: Game_state, curr_card: Card): void {
    const valid_help_inputs = ["display", "quit", "help" , "color", ""]
    while(true && !gs.is_game_over) {
        const input_str = prompt("Do you want to draw card, pick new from hand or skip turn? [draw/pick/skip]: ");
        if(input_str === "draw"){
            const new_c = draw_card_from_deck(gs.game_deck);
            add_card_to_hand(new_c, gs.all_hands.player_hand);
            if(matches_card_or_wild(new_c, curr_card)){
                console.log("\nplaying card: ", new_c.tag);
                player_make_play(gs, new_c.tag, curr_card);
                break;
            } else {
                console.log("\nno match, added card to hand: ", new_c.tag);
                gs.current_turn = "ai";
                break;
            }
        } else if(input_str === "pick"){
            const new_pick_from_hand = prompt("Pick a card: ");
            player_make_play(gs, new_pick_from_hand, curr_card);
            break;
        } else if(input_str === "skip"){
            console.log("\nSkipped turn, draw 1 card as penalty\n");
            add_card_to_hand(draw_card_from_deck(gs.game_deck), gs.all_hands.player_hand);
            gs.current_turn = "ai"
            break;
        } else if(valid_help_inputs.includes(input_str)) {
            help_ops_for_player(gs, input_str, curr_card);
        } else {
            console.log("\ninvalid input, you can only pick [draw/pick/skip]\n")
        }
    }
}

/**
 * makes a play in UNO for the player or ai and executes effects of cards
 * @param game_state the overall state of the game
 * @param input_str a string that represent what card to pick
 */
export function make_play(game_state: Game_state, input_str: string, curr_card: Card): void {
    if(game_state.current_turn === "player") {
        player_make_play(game_state, input_str, curr_card);
    } else {
        ai_make_play(game_state, input_str, curr_card);
    }
}


function game_run() {
    const valid_help_inputs = ["display", "quit", "help", "no card" , "color", ""];
    if(welcome_screen()){
        game_rule();
        const game_state: Game_state = {
            all_hands: {ai_hand: {}, player_hand: {}},
            game_deck: make_deck(),
            game_pile: make_gp(),
            current_turn: "player",
            is_game_over: false
        };

        start_of_game_dist(game_state.all_hands, game_state.game_deck);
        game_state.game_pile = starting_game_pile(game_state.game_pile, game_state.game_deck);

        //ends when there is hand of length 0 or is game over = true
        while(game_conditional(game_state)){
            if(game_state.game_deck[1] - game_state.game_deck[0] < 20){
                game_state.game_pile = refill_deck_from_gp(game_state.game_pile, game_state.game_deck);
            } else {}
            const current_card = current_top_card(game_state.game_pile);
            game_state.current_color = color_of_card(current_card);
            console.log("------------------------------------------------------------------------")
            console.log(`\nDiscard pile: |${current_card.tag}|`);
            console.log("current color: ", game_state.current_color);

            if(game_state.current_turn === "player"){//user play
                console.log("\nyour current hand is: ")
                console.log(display_hand(game_state.all_hands.player_hand));
                const player_input = prompt("Pick a card: ");

                if(valid_help_inputs.includes(player_input)
                    || player_input.trim() === ""
                    || !is_valid_input(player_input)){//handles all possible invalids

                    help_ops_for_player(game_state, player_input.trim(), current_card);

                } else {
                    make_play(game_state, player_input, current_card);
                }

                if(check_for_uno(game_state.all_hands.player_hand)){
                    console.log("\nPlayer has UNO!\n")
                } else {}

            } else {//ai play
                if(can_ai_match(game_state.all_hands.ai_hand, current_card)){
                    const ai_play: Card = ai_picked_card(game_state.all_hands.ai_hand, current_card);
                    make_play(game_state, ai_play.tag, current_card);
                    //console.log("AI hand is: ", display_hand(game_state.all_hands.ai_hand)); //for debug ai
                } else {
                    console.log("\nai has no matching card, draws a new card from deck.\n");
                    dist_cards(game_state.game_deck, game_state.all_hands.ai_hand, 1);
                    game_state.current_turn = "player";
                }

                if(check_for_uno(game_state.all_hands.ai_hand)){
                    console.log("\nAI has UNO!\n")
                } else {}
            }
        }

        if(is_winning(game_state.all_hands.player_hand)){
            console.log("\nCongratulations, you beat the AI!\n");
        } else if (is_winning(game_state.all_hands.ai_hand)) {
            console.log("\nYou lost, better luck next time!\n");
        } else {
            console.log("\nGame ended\n");
        }
    }
}

/**run this function to play the game.
 * //for random num gen
 * npm install lodash
 * npm install --save-dev @types/lodash
 *
 * //for prompting and inputs
 * npm install prompt-sync
 * npm install --save-dev @types/prompt-sync
 *
*/

//to run in terminal, enter:
//1. cd src.
// 2. tsc --strict game.ts; node game.js
function main(){
    game_run();
}

main();