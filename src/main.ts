import { Card, Deck, GamePile, Game_state } from "./types";

import { make_deck, draw_card_from_deck } from "./deck";

import { is_empty as is_empty_q } from "../lib/queue_array";

import { ai_make_play, ai_picked_card, can_ai_match } from "./ai-logic";

import {
    refill_deck_from_gp, is_card_in_hand,
    is_valid_input, is_winning, delete_card_from_hand,
    add_card_to_gp, start_of_game_dist, display_hand, dist_cards,
    draw_plus_2_or_4, add_card_to_hand, get_card_from_hand, check_for_uno,
    color_of_card, value_of_card, current_top_card,
    make_gp, matches_card_or_wild, starting_game_pile
    } from "./game-comp";

import PromptSync = require ("prompt-sync");
const prompt: PromptSync.Prompt = PromptSync({sigint:true});

//simple way to reverse current turn
export function next_person_turn(gs: Game_state){
    if(gs.current_turn === "player"){
        return "ai"
    } else {
        return "player"
    }
}

/**
 * checks if game is to be continued or to exit the game
 * @param game_state the overall state of the game,
 * including player hands and is_game_over boolean variable
 * @complexity theta(n) time complexity where n is number of cards in player and ai hand
 * @returns true if player and ai hands are not empty
 * and if the is_game_over component in game_state is false. false otherwise.
 */

export function game_conditional(game_state: Game_state): boolean {
    return (!game_state.is_game_over
           && !is_winning(game_state.all_hands.ai_hand)
           && !is_winning(game_state.all_hands.player_hand));
}

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
 * a help interface for player.
 * @param game_state the overall state of the game
 * @param player_input the input string
 * @param curr_card the card to match against
 */
export function help_ops_for_player(game_state: Game_state, player_input: string, curr_card: Card): void {
    if(player_input === "display") {
        console.log(display_hand(game_state.all_hands.player_hand));
    } else if(player_input === "quit"){
        game_state.is_game_over = true;
    } else if(player_input === "no card"){
        draw_another(game_state, curr_card);
    } else if (player_input === "help"){
        console.log("\nTo view your cards enter: display");
        console.log("if you have no matching card enter: no card");
        console.log("To see the current discard pile color enter: color");
        console.log("to view help commands again enter: help");
        console.log("To quit game enter: quit\n");
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
            game_state.current_color = player_col_pick;
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
    console.log("The goal of the game is to get rid of all your cards before the computer.");
    console.log("\n- To place a card: enter the color and value of the chosen card.");
    console.log("- example: 'red 7' or 'wild +4' or 'yellow skip'.");
    console.log("- To see your hand of UNO cards enter: display");
    console.log("- if you dont have a matching card enter: no card");
    console.log("- to quit the game enter: quit");
    console.log("\nGood luck\n");
}
/**
 * checks if a card matches another card or if it matches the color of the discard pile
 * @param game_state overall gamstate
 * @param pl_input the tag of a card to check
 * @param curr_card card to check against
 * @returns true if input card tag matches color or value with current card,
 * or if it matches current color of discard pile. false otherwise.
 */
export function matches_general(game_state: Game_state, pl_input: string, curr_card: Card): boolean {
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

        const player_pick: Card = get_card_from_hand(player_input, game_state.all_hands.player_hand);
        game_state.game_pile = add_card_to_gp(player_pick, game_state.game_pile);
        delete_card_from_hand(player_pick, game_state.all_hands.player_hand);

        if(color_of_card(player_pick) === "wild" && value_of_card(player_pick) === "+4"){
                pick_new_color_wild(game_state);
                draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.ai_hand, player_pick);
                console.log("\nAI draws 4\n");
                console.log("\nPlayer turn again!\n")
                game_state.current_turn = "player";

        } else if (color_of_card(player_pick) === "wild" && value_of_card(player_pick) === "new-color"){
                pick_new_color_wild(game_state);
                game_state.current_turn = "ai";

        } else if(value_of_card(player_pick) === "+2" && matches_card_or_wild(player_pick, curr_card)){
                console.log("\nAI gets to draw 2 and skip turn\n")
                draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.ai_hand, player_pick);
                game_state.current_color = color_of_card(player_pick);
                game_state.current_turn = "player";

        } else if((value_of_card(player_pick) === "skip" || value_of_card(player_pick) === "reverse")
                       && matches_card_or_wild(player_pick, curr_card)) {
                console.log("\nAI turn skipped\n");
                game_state.current_color = color_of_card(player_pick);
                game_state.current_turn = "player";

        } else if(typeof value_of_card(player_pick) === "number" && matches_card_or_wild(player_pick, curr_card)) {
            game_state.current_color = color_of_card(player_pick);
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
            if(matches_general(gs, new_c.tag, curr_card)){
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
            console.log(`\nDiscard pile: |${current_card.tag}| \nCurrent color: ${game_state.current_color}`);

            if(game_state.current_turn === "player"){
                console.log("\nyour current hand is: ");
                console.log(display_hand(game_state.all_hands.player_hand));
                const player_input = prompt("Pick a card: ");

                if(valid_help_inputs.includes(player_input)
                    || player_input.trim() === ""
                    || !is_valid_input(player_input)){
                    //handles invalid inputs
                    help_ops_for_player(game_state, player_input.trim(), current_card);
                } else {
                    make_play(game_state, player_input, current_card);
                }

                if(check_for_uno(game_state.all_hands.player_hand)){
                    console.log("\nPlayer has UNO!\n")
                } else {}

            } else {
                if(can_ai_match(game_state.all_hands.ai_hand, current_card)){
                    const ai_play: Card = ai_picked_card(game_state.all_hands.ai_hand, current_card);
                    make_play(game_state, ai_play.tag, current_card);
                } else {
                    console.log("\nAI has no matching card, draws a new card from deck.\n");
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
            console.log("\nYou lost against AI, better luck next time!\n");
        } else {
            console.log("\nGame ended!\n");
        }
    }
}

//run function main() to play game.
function main(){
    game_run();
}

//main();