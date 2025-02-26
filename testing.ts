import { is_null, head, list, tail, List, pair } from "./lib/list";
import { Card, Color, Value, Card_info, Hand } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q, enqueue, dequeue, head as q_head, display_queue } from "./lib/queue_array";

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

//example: make_card(red, 7) ===>>>> {red7: {color: red, value: 7}};
function make_card(col: Color, val: Value): Card {
    return {
        tag: `${col}${val}`,
        CI: {color: col, value: val}
    };
    
    //return {[`${col}${val}`]: {color: col, value: val}};
}
function many_enques<T>(n: number, q: Queue<T>, e: T): Queue<T> {

    for(let j = 0; j < n; j++) {
        enqueue(e, q);
    }

    return q;
}

//display_queue(many_enques<boolean>(2, empty_q<boolean>(), true));


//console.log(make_card("red", 9));

function make_color(col: Color, q: Queue<Card> ): Queue<Card> {
    const p2 = "+2";
    const skip = "skip"; 
    const rev = "reverse";
    //let res = null;

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

    //add one 0 card to q
    enqueue(make_card(col, 0), q);
    
    return q;
}

function make_wild_card(q: Queue<Card>): Queue<Card> {
    const col: Color = "wild";
    const take_4: Value = "+4";
    const pick_col: Value = "new color";
    const made_4 = make_card(col, take_4);
    const made_pick_c = make_card(col, pick_col);
    many_enques(4, q, made_4);
    many_enques(4, q, made_pick_c);

    return q;
    
}

// function make_all_cards(): Queue<Card> {
//     const deck: Queue<Card> = empty_q();
// function make_all_cards(): Queue<Card> {
//     const deck: Queue<Card> = empty_q();


// }

function add_card_to_hand(c: Card, hand: Hand) {

}


const p_hand: Queue<Card> = empty_q<Card>();

// make_color("red", p_hand);
// make_color("yellow", p_hand);
// make_color("blue", p_hand);
// make_color("green", p_hand);
// make_wild_card(p_hand);

// display_queue(p_hand);

//now we have a deck.


//add card to hand function test

//export type Card = {[tag: string]: Card_info};

const foo = make_card("blue", 5);

console.log(foo.CI);
    
// }