import { is_null, head, list, tail, List, pair } from "./lib/list";
import { Card, Color, Value, Card_info, Hand } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q, enqueue, dequeue, head as q_head } from "./lib/queue_array";

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

//example: make_card(red, 7) ===>>>> {red7: {color: red, value: 7}};
function make_card(col: Color, val: Value): Card {
    return { [`${col}${val}`]: { color: col, value: val } };
}

//console.log(make_card("red", 9));

function make_color(col: Color): List<Card> {
    const p2 = "+2";
    const skip = "skip";
    const rev = "reverse";
    let res = null;

    for (let i = 1; i < 10; i++) {

        const curr = make_card(col, i); //make red1 ex
        res = pair(curr, pair(curr, res)); //2 av varje kort läggs till listan
        //console.log(list(curr, curr));
    }

    const p2_card = make_card(col, p2);
    res = pair(p2_card, pair(p2_card, res));

    const skip_card = make_card(col, skip);
    res = pair(skip_card, pair(skip_card, res));

    const rev_card = make_card(col, rev);
    res = pair(rev_card, pair(rev_card, res));

    //loop for making 0 card:
    res = pair(make_card(col, 0), res);

    // let colz: List<Color> = list("red", "blue", "yellow", "green");

    // while(!is_null(colz)) {
    //     res = pair(make_card(head(colz), 0), res);
    //     colz = tail(colz);
    // }

    // while(!is_null(res)){
    //     console.log(head(res));
    //     res = tail(res);
    // }



    return res;
}

//make_color("blue");


function make_wild_card(): List<Card> {
    const col: Color = "wild";
    const take_4: Value = "+4";
    const pick_col: Value = "new color";

    const made_4 = make_card(col, take_4);
    const made_pick_c = make_card(col, pick_col);

    const res_l = list(made_4, made_4, made_4, made_4,
        made_pick_c, made_pick_c, made_pick_c, made_pick_c);
    return res_l;

}

function make_all_cards(): Queue<Card> {
    const deck: Queue<Card> = empty_q();


}


//hej

