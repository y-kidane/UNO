import { is_null, head, list, tail, List, pair, append } from "./lib/list";
import { Card, Color, Value, Card_info, Hand } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q, enqueue, dequeue, head as q_head, display_queue } from "./lib/queue_array";


//example: make_card(red, 7) ===>>>> {red7: {color: red, value: 7}};
function make_card(col: Color, val: Value): Card {
    return {
        tag: `${col}${val}`,
        CI: {color: col, value: val}
    };
}

function many_enques<T>(n: number, q: Queue<T>, e: T): Queue<T> {
//easy to enque many times
    for(let j = 0; j < n; j++) {
        enqueue(e, q);
    }

    return q;
}
//makes all cards from one color
function make_color(col: Color, q: Queue<Card> ): Queue<Card> {
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
function shuffle(q: Queue<Card>): Queue<Card>  {
    const q_arr = q[2];
    const len = q_arr.length;
    for(let i = len - 1; i >= 0; i--) { 
        let j = random_int(i);
        swap(q_arr, i, j);
    }
    q[2] = q_arr;//modded Q array.
    return q;
}
//function delete card from hand:
//OBS we have dynamic keys so for accessing values in a record we need
// to use record[tag] instead of record.tag
function delete_card_from_hand(c: Card, hand: Hand): boolean {
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
function add_card_to_hand(c: Card, hand: Hand): void {
    const tag = c.tag;
    if(hand[tag] === undefined) {
        hand[tag] = list(c.CI);
    } else {
        hand[tag] = pair(c.CI, hand[tag]);
    }
}
const hnd: Hand = {};
add_card_to_hand(make_card("red", 4), hnd);
add_card_to_hand(make_card("red", 4), hnd);
console.log(hnd.red4);
delete_card_from_hand(make_card("red", 4), hnd);
console.log(hnd.red4);

