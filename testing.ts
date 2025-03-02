import { is_null, head, list, tail, List, pair, append } from "./lib/list";
import { Card, Color, Value, Card_info, Hand } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q, 
    enqueue, dequeue, head as q_head, display_queue } from "./lib/queue_array";
import { pop, top, Stack, NonEmptyStack, empty as empty_s, 
    is_empty as is_empty_s, push,  } from "./lib/stack";

//example: make_card(red, 7) ===>>>> {red7: {color: red, value: 7}};
export function make_card(col: Color, val: Value): Card {
    return {
        tag: `${col}${val}`,
        CI: {color: col, value: val}
    };
}

export function many_enques<T>(n: number, q: Queue<T>, e: T): Queue<T> {
//easy to enque many times
    for(let j = 0; j < n; j++) {
        enqueue(e, q);
    }

    return q;
}
//makes all cards from one color
export function make_color(col: Color, q: Queue<Card> ): Queue<Card> {
    const p2 = "+2";
    const skip = "skip";
    const rev = "reverse";
    for(let i = 1; i < 10; i++) {
        const curr = make_card(col, i); 
        many_enques(2, q, curr);
    }
    const p2_card = make_card(col, p2);
    many_enques(2, q, p2_card);
    const skip_card = make_card(col, skip);
    many_enques(2, q, skip_card);
    const rev_card = make_card(col, rev);
    many_enques(2, q, rev_card);
    enqueue(make_card(col, 0), q);
    return q;
}

export function make_wild_card(q: Queue<Card>): Queue<Card> {
    const col: Color = "wild";
    const take_4: Value = "+4";
    const pick_col: Value = "new color";
    const made_4 = make_card(col, take_4);
    const made_pick_c = make_card(col, pick_col);
    many_enques(4, q, made_4);
    many_enques(4, q, made_pick_c);
    return q;
}
function random_int(max: number): number {
    //returns number 0-max in a random fashion
    return Math.floor(Math.random() * max);
}
function swap<T>(A: Array<T>, i: number, j: number): void {
    //swaps place on 2 indexes in an array
    const temp = A[i];
    A[i] = A[j];
    A[j] = temp;
}
//fisher yates algo
export function shuffle(q: Queue<Card>): Queue<Card>  {
    const q_arr = q[2];
    const len = q_arr.length;
    for(let i = len - 1; i >= 0; i--) { 
        let j = random_int(i + 1);
        swap(q_arr, i, j);
    }
    q[2] = q_arr;//modded Q array.
    return q;
}
//function delete card from hand:
//OBS we have dynamic keys so for accessing values in a record we need
// to use record[tag] instead of record.tag
//if key is not in record => undefined
export function delete_card_from_hand(c: Card, hand: Hand): boolean {
    const t = c.tag;
    if(!is_null(hand[t])) {
        hand[t] = tail(hand[t]);
        if(is_null(hand[t])) {
            delete hand[t];
        } else {}
        
        return true;
    } else {
        return false;
    }
}
export function add_card_to_hand(c: Card, hand: Hand): void {
    const tag = c.tag;
    if(hand[tag] === undefined) {
        hand[tag] = list(c.CI);
    } else {
        hand[tag] = pair(c.CI, hand[tag]);
    }
}

// const hnd: Hand = {};
// add_card_to_hand(make_card("red", 4), hnd);
// add_card_to_hand(make_card("red", 4), hnd);
// console.log(hnd.red4);
// delete_card_from_hand(make_card("red", 4), hnd);
// console.log(hnd.red4);

//fix distribute card function, input(deck, player_hand, computer_hand)

function make_deck(): Queue<Card> {
    const deck_q: Queue<Card> = empty_q();
    make_color("red", deck_q);
    make_color("yellow", deck_q);
    make_color("green", deck_q);
    make_color("blue", deck_q);
    make_wild_card(deck_q)
    shuffle(deck_q);

    return deck_q;
}
//
// const dex = make_deck();
// const dex_arr = dex[2];
// for(let i = 0; i < dex_arr.length; i++) {
//     console.log(dex_arr[i]);
// }

//each player gets 7 cards at beginning:

function dist_cards(q: Queue<Card>, hand: Hand) {
    for(let i = 0; i < 7; i++) {
        const card_to_add = q_head(q);
        add_card_to_hand(card_to_add, hand);
        dequeue(q);
    }
}

const phand: Hand = {};
const test_deck:Queue<Card> = make_deck(); 
// dist_cards(test_deck, phand);

// console.log(phand["red+2"]);
// console.log("head in q is now index: ", test_deck[0]);
// console.log("cards left after distribution: ", test_deck[2]);

// const handz: Hand = {
//     blue4: [ { color: 'blue', value: 4 }, null ],
//     red6: [ { color: 'red', value: 6 }, null ],
//     yellow1: [ { color: 'yellow', value: 1 }, null ],
//     yellow2: [ { color: 'yellow', value: 2 }, null ],
//     yellow8: [ { color: 'yellow', value: 8 }, null ],
//     yellow5: [ { color: 'yellow', value: 5 }, null ],
//     'red+2': [ { color: 'red', value: '+2' }, null ]
// };

// add_card_to_hand(make_card("yellow", 1), handz);
// console.log(handz["yellow1"]);

//we need to return new game pile after every application
function add_card_to_gp(c: Card, game_pile: Stack<Card>) {
    const after_adding: NonEmptyStack<Card> = push(c, game_pile);
    return after_adding;
}

function current_card(gp: NonEmptyStack<Card>): Card {
    return top(gp);
}

function draw_plus(deck: Queue<Card>, hand: Hand, val: Card): void {
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


draw_plus(test_deck, phand, make_card("green", "+4"));

console.log(phand);


//start game logic: 

/**
 * 
 * 
 * {
 * welcome screen displayed = helloUNO()
 * 
 * distribute cards to player  = create player and computer hand(), empty record hands
 * distribute cards to computer = distribute_card to both(hand, hand, deck);
 * 
 * display player cards, ex: (red4, blue2, plus4) = display players cards(hand), from record from to string. 
 * 
 * 
 * player puts card on game pile. ask what card to place(hand, tag: card that the player choose)
 * check if valid move, current color is red;  red4, blue4, yellow4 => check red4, check b4, check y4
 * is_valid_move(hand, picked card, current card)
 * 
 * make current value = color, ex red, 
 * add card to game pile(card, stack: game pile)
 * let current state: x = {color, value}:
 * col = x.color
 * val = x.value
 * 
 * turn change, comuters turn now. 
 * change turn
 * take a card(hand, deck, current state); 
 * 
 * have computer pick card thet follows current value, 
 * 
 * function AI(hand, deck, current state): 
 * for each in hand check if match current state
 * should be able to find card in hand that matches current state
 * place that card
 * 
 * turn change .........
 * 
 * if(len player hand is 1) { dipslay palyer ahs uno}
 * 
 * until someone has UNO, 1 card left. 
 * 
 * continue play until UNO person plays last card. 
 * 
 * is winning(player hand, computer hand) check if len of any is 0: boolean
 * if true end game, someone has won. 
 * 
 * 
 * functions to build: 
 * }
 * 
 * 
 */

/**
 * functions: 
 * 
 * welcome_screen()
 * make_hands()
 * distribute_to_players_hands()
 * 
 * display_players_hand() - lite svår 
 * ask_what_card_to_place(), can be many cards, lite svår, behöver hantera flera kort
 * pick_up_more_cards(), när man inte har färgen eller value
 * is_valid_mode() - lite jobbig
 * add_to_game_pile(lista(cards to add), gamepile) lite svår
 * make_current_state()
 * change_turn, after placing card - lite svår
 * check_if_UNO()
 * is_winning(), check if len 0 on any hand, if true end game. 
 * 
 * AI: 
 * find_valid_card(), compared to current state, else pick wild - svårast
 * loop_pick_more_cards()
 * 
 * OBS split into modules:
 * 
 * ex: types, cards, deck management, gamelogic, AI logic
 * so to play the game you only need to execute game.ts
 * 
 * 
 * 
 */