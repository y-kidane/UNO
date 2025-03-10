import { is_null, head, list, tail, List, pair, append, for_each, length as list_length } from "../lib/list";
import { Card, Color, Value, Card_info, Hand, Deck, GamePile, Mult_hands, Game_state } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q,
    enqueue, dequeue, head as q_head, display_queue } from "../lib/queue_array";
import { pop, top, Stack, NonEmptyStack, empty as empty_s,
    is_empty as is_empty_s, push,  } from "../lib/stack";
import { make_deck, make_card, shuffle, make_wild_card, random_num } from "./deck";
import * as promptSync from 'prompt-sync';
import { first, split } from "lodash";
import { AI_match_col_or_val, can_ai_match, ai_picked_card, AI_tags_in_arr, hand_to_card_arr } from "./ai-logic";
//here we make the main game logic, this is the file to run to play the game.
/**
 * draw one card from a deck
 * @param deck the deck to draw card from
 * @returns returns a card
 */
export function draw_card_from_deck(deck: Deck): Card {
    const drawn_c = q_head(deck);
    dequeue(deck);
    return drawn_c;
}

/**
 * checks if a card is in a hand.
 * @param hand the hand to check in
 * @param tag the tag for the card to look for in hand
 * @returns true iff card is in hand, false otherwise.
 */
export function is_card_in_hand(hand: Hand, tag: string): boolean {
    const arr_cards = display_hand(hand);
    if(arr_cards.includes(tag)){
        return true;
    } else {
        return false;
    }
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
 * retrives card from a hand
 * @param tag the tag of the card to get
 * @param hand the hand to get card from
 * @precondition the card represented by tag must be in hand
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
 * @precondition the game pile may not be empty.
 * @returns the card on top of the stack, last played card.
 * returns false if game pile is empty.
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
function is_val_num_or_str(str: string): string | number {
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
    const val = is_val_num_or_str(split_input[1]);

    return valid_colors.includes(col) && valid_values.includes(val);
}

function input_to_tag(inp: string): string {
    const input_str = inp.split(/\s+/);
    if(input_str.length > 1){
        return `${input_str[0]} ${input_str[1]}`
    } else {
        return ""
    }
}
// console.loginput_to_tag("red  4");

/**
 * prints welcome message and asks if user wants to play
 * @returns true if input is "y", false if "n", loop otherwise
 */
function welcome_screen(): boolean {
    const prompt = promptSync();
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
 */
export function help_ops_for_player(game_state: Game_state, player_input: string): void{
    if(player_input === "display") {
        console.log(display_hand(game_state.all_hands.player_hand));
    } else if(player_input === "quit"){
        game_state.is_game_over = true;
    } else {
        console.log("To view your cards enter: display");
        console.log("To quit game enter: q");
        console.log("To draw card enter: draw");
        console.log("to view help commands again enter: help");
    }
}

// else if(player_input === "draw"){
//     const drawn_card = draw_card_from_deck(game_state.game_deck);
//     add_card_to_hand(drawn_card, game_state.all_hands.player_hand);
//     console.log(`Added card: ${drawn_card.tag} to hand`);
// }
/**
 * handles picking new color after wild card.
 * @returns the inputed string from the prompt, which is the new color
 */

export function pick_new_color_wild(game_state: Game_state): string | undefined {
    const valid_colors = ["red", "green", "yellow", "blue"];
    const prompt = promptSync();
    console.log("Wild card!")
    while(true){
        const player_col_pick = prompt("Pick a new color: ");
        if(valid_colors.includes(player_col_pick)){
            console.log(`\nNew color is: ${player_col_pick}\n`);
            return player_col_pick;
        } else if (player_col_pick === "quit") {
            game_state.is_game_over = true;
            break;
        } else {
            console.log(`Invalid color, allowed colors are: ${valid_colors}`);
        }
    }
}

/**
 * distributes 7 cards each to each hand in all_hands
 * @param hands a record containing hands
 * @precondition deck must be nonempty
 * @param deck the deck to pick cards from
 */
export function start_of_game_dist(all_hands: Mult_hands, deck: Deck): void {
    dist_cards(deck, all_hands.player_hand, 7);
    dist_cards(deck, all_hands.ai_hand, 7);
}
function game_rule() {
    console.log("\nHow to play: \n");
    console.log("The goal of the game is to get rid of all your cards before the computer");
    console.log("\n- To place a card: enter the color and value of the chosen card.");
    console.log("example: 'red 7' or 'wild +4' or 'yellow skip");
    console.log("- To see your hand of UNO cards enter: display");
    console.log("- To draw a card from deck enter : draw");
    console.log("- to quit the game enter: quit");
    console.log("\nGood luck\n");
}
/**
 * checks if game is to be continued or to exit the game
 * @param game_state the overall state of the game, including player hands
 * @returns true if player or ai hand has length 0,
 * or if the game_over component in game state is true. false otherwise.
 */
function game_conditional(game_state: Game_state): boolean{
    return !game_state.is_game_over ||
    (!is_winning(game_state.all_hands.ai_hand) &&
    !is_winning(game_state.all_hands.player_hand));
}

//simple way to reverse current turn
function inverse_turn(gs: Game_state){
    if(gs.current_turn === "player"){
        return "ai"
    } else {
        return "player"
    }
}

/**
 * makes a play in UNO for the player, no turn change
 * after placing cards with value: "skip", "reverse", "+2" or "+4"
 * @param game_state the overall state of the game
 * @param input_str a string that represent what card to pick or help options
 */
function make_play(game_state: Game_state, input_str: string, curr_card: Card): void {

    if(game_state.current_turn === "player"){

        if(is_valid_input(input_str) && is_card_in_hand(game_state.all_hands.player_hand, input_str)) {

            const picked_card: Card = get_card_from_hand(input_str, game_state.all_hands.player_hand);
            game_state.game_pile = add_card_to_gp(picked_card, game_state.game_pile);
            delete_card_from_hand(picked_card, game_state.all_hands.player_hand);

            if(picked_card.CI.color === "wild" && picked_card.CI.value === "+4"){
                const new_col = pick_new_color_wild(game_state);
                game_state.current_color = new_col;
                draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.ai_hand, picked_card);
                console.log("ai draws 4");

            } else if (picked_card.CI.color === "wild" && picked_card.CI.value === "new-color"){
                const new_col1 = pick_new_color_wild(game_state);
                game_state.current_color = new_col1;
                //turn change

            } else if(picked_card.CI.value === "+2" && curr_card.CI.value === "+2"){
                console.log("AI gets to draw 2 and skip turn")
                draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.ai_hand, picked_card);
                game_state.current_turn = "player";

            } else if(picked_card.CI.value === "skip" || picked_card.CI.value === "reverse") {
                console.log("AI turn skipped");
                game_state.current_turn = "player"

            } else if(typeof picked_card.CI.value === "number") {
                game_state.current_turn = "ai";
            } else {
                game_state.is_game_over = true;
                //testing with new alt
            }

        } else {
            console.log("Invalid choice");
            const draw_prompt = promptSync();
            const draw_res = draw_prompt("Do you want to draw new card? [y/n]");
            if(draw_res === "y"){
                const drawn_card = draw_card_from_deck(game_state.game_deck);
                if(drawn_card)
                console.log("Added card to hand: ", drawn_card.tag);
                add_card_to_hand(drawn_card, game_state.all_hands.player_hand);

            } else {
                game_state.current_turn = "ai";
            }

            game_state.current_turn = "ai";
            //console.log(display_hand(game_state.all_hands.player_hand));
        }

    } else {
        const ai_picked_card = get_card_from_hand(input_str, game_state.all_hands.ai_hand);
        game_state.game_pile = add_card_to_gp(ai_picked_card, game_state.game_pile);
        delete_card_from_hand(ai_picked_card, game_state.all_hands.ai_hand);


        //use matches card or wild function
        if(ai_picked_card.CI.color === "wild" && ai_picked_card.CI.value === "+4"){
            draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.player_hand, ai_picked_card);
            console.log("player draws 4");
            const random_num_ai = random_num(0, 3);
            const random_col = ["red", "green", "yellow", "blue"][random_num_ai];
            game_state.current_color = random_col;
            console.log("New color is: ", random_col);

        } else if (ai_picked_card.CI.color === "wild" && ai_picked_card.CI.value === "new-color"){
            const random_num_ai = random_num(0, 3);
            const random_col = ["red", "green", "yellow", "blue"][random_num_ai];
            game_state.current_color = random_col;
            console.log("New color is: ", random_col);
            game_state.current_turn = "player";

        } else if(ai_picked_card.CI.value === "+2"){
            console.log("player gets to draw 2")
            draw_plus_2_or_4(game_state.game_deck, game_state.all_hands.player_hand, ai_picked_card);
            game_state.current_color = ai_picked_card.CI.color;
            game_state.current_turn = "player";

        } else if(ai_picked_card.CI.value === "skip" || ai_picked_card.CI.value === "reverse") {
            game_state.current_color = ai_picked_card.CI.color;
            console.log("player turn skipped");

        } else if(typeof ai_picked_card.CI.value === "number") {
            game_state.current_color = ai_picked_card.CI.color;
            game_state.current_turn = "player";
        } else {}
    }
}

export function draw_another(gs: Game_state, curr_card: Card): void {
    const input_prompt = promptSync();
    const input_str = input_prompt("Do you want to draw a card? [y/n]");
    if(input_str === "y"){
        const new_c = draw_card_from_deck(gs.game_deck);
        if(matches_card_or_wild(new_c, curr_card)){
            console.log("played card: ", new_c.tag);
            gs.game_pile = add_card_to_gp(new_c, gs.game_pile);
        } else {
            console.log("no match, added card to hand: ", new_c.tag);
            add_card_to_hand(new_c, gs.all_hands.player_hand);
            gs.current_turn = "ai";
        }
    }
}


function game_run() {
    const valid_help_inputs = ["display", "quit", "help", ""];//anything but these is helpscreen
    const prompt = promptSync();
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
        console.log("These are your cards: ", display_hand(game_state.all_hands.player_hand));
        game_state.game_pile = starting_game_pile(game_state.game_pile, game_state.game_deck);

        //ends when there is hand of length 0 or is game over = true
        while((!is_winning(game_state.all_hands.ai_hand) &&
            !is_winning(game_state.all_hands.player_hand)) && !game_state.is_game_over){

            const current_card = current_top_card(game_state.game_pile);
            game_state.current_color = current_card.CI.color;
            console.log("The top card is: ", current_card.tag);

            if(game_state.current_turn === "player"){
                const player_input = prompt("Pick a card: ");
                if(valid_help_inputs.includes(player_input)){
                    help_ops_for_player(game_state, player_input);
                } else {
                    make_play(game_state, player_input, current_card);
                }
            } else if(game_state.current_turn === "ai"){

                if(can_ai_match(game_state.all_hands.ai_hand, current_card)){
                    const ai_play: Card = ai_picked_card(game_state.all_hands.ai_hand, current_card);
                    make_play(game_state, ai_play.tag, current_card);
                    console.log("AI hand is: ", display_hand(game_state.all_hands.ai_hand)); //for debug ai
                } else {
                    console.log("ai has no matching card, draws a new card from deck.");
                    dist_cards(game_state.game_deck, game_state.all_hands.ai_hand, 1);
                    game_state.current_turn = "player";
                }
            } else {
                //break;
            }
        } //end of while loop
        if(is_winning(game_state.all_hands.player_hand)){
            console.log("Congratulations, you beat the AI!");
        } else if (is_winning(game_state.all_hands.ai_hand)) {
            console.log("You lost, better luck next time!");
        } else {
            console.log("Game ended");
        }
    }
}

//run this function to play the game.
function main(){
    game_run();
}

main();