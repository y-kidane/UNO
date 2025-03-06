
//red, green, blue, yellow: 2 * (1-9, skip, reverse, +2) 
//  one 0 in each color
// 4 *  wild only pick color
// 4 * wild pick color and draw 4
//tot 108 cards:

//making a hand, that is easy to pick from, a record with tags as keys and card_info as value
// const player_hand: Hand = {};

// player_hand["red4"] = list({color: "red", value: 4}, {color: "red", value: 4});

// //console.log(player_hand);

// player_hand["blue6"] = list({color: "blue", value: 6});
// player_hand["draw4"] = list({color: "wild", value: "+4"});
// player_hand["green9"] = list({color: "green", value: 9});

// const test1 = player_hand.red4;

// if(!is_null(test1)) {
//     console.log((test1));
//     console.log(head(test1));
// } else {}



// console.log("color should be wild ==== ", player_hand.draw4.color);
// console.log("after adding: ");

//gives number of keys in the record:

//console.log(Object.keys(player_hand).length);

//maybe type Card = {[tag: string]: Card_info};
//should have list(Card_info, Card_info) and when a card is picked we only have list(Card_info), 
//and when the last card is picked => list() then remove that key-val from the record. 

//

// type Card = {tag: "blue6", color: "blue", value: 6};

// ex red and 
// function make_tag(col: Color, val: Value): string {
//     return `${col}${val}`;
// }





//const test_deck: Queue<Card> = empty_q<Card>();

//make_color("red", test_deck);
// make_color("yellow", p_hand);
// make_color("blue", p_hand);
// make_color("green", p_hand);
// make_wild_card(p_hand);

// display_queue(p_hand);

//now we have a deck.


//add card to hand function test

//export type Card = {[tag: string]: Card_info};

//const foo = make_card("blue", 5);

//console.log(foo.CI);
    
// }
//__________________________________________________________________________________________________________



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
 * is_valid_move() - lite jobbig
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

//testing prompt and parsing:

//general stricture:
/**
 * function game_loop() {
    prompt: welcome to uno, do you want to play a game?: [y/n?]
    if prompt === yes {
    
    start game: 

    create deck, shuffle
    create game pile, stack.

    create player and computer hand
    distribute 7 cards each for the hands

    display player "these are your cards: " hand

    place 1 random card from the deck to start the game

    player places first card, by inputing strings that are the tags for their cards, 
    parse input and  validate the tags to players hand.

    fi valid input => add cards to game pile and remove from player hands

    change turn: maybe do true/false or even odd for changint turn

    ex let counter turn = 0, when player plays a card, add 1 to counter, now its odd, when odd its computer turn
    when computer has placed card, increment counter by 1, now even num, player turn. 

    change turn


    random card from deck is placed on game pile

    display player 
    
    }
}

 * 
 * 
 * 
 */


//i inst
//prompt and input:

