import { Pair, pair, list, List, head, tail, is_null, length } from "./lib/list";

//here we have defined the types for the whole game. 

/**
 * represent the color of a card.
 */
export type Color = "red" | "yellow" | "blue" | "green" | "wild";

/*
The type of value a card can have
**/
export type Value = number | "+4" | "+2" | "new color" | "skip" | "reverse";

// ex: {color: "red", value: 4}
/**
 * information about a card, described by 2 parameters
 * 
 */
export type Card_info = {color: Color, value: Value}; 

// ex {red4: {color: "red", value: 4}}
//     = key      =value
//export type Card = {[tag: string]: Card_info};
export type Card = {tag: string, CI: Card_info};


//ex {red4: {color: "red", value: 4}, 
//    blue6: { color: 'blue', value: 6 }}

export type Hand = Record<string, List<Card_info>>;
//arr shuffle func already exists
//removing card: by its tag/key

//ex delete player_hand[key];

//adding card to hand: needs tag and card_info:
// player_hand[new_key] = card

//now testing making each card value a pair to contain 2 of each cards


