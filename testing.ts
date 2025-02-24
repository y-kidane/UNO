//hello
// UNO cards we need to have

//red, green, blue, yellow: 2 * (1-9, skip, reverse, +2) 
//  one 0 in each color
// 4 *  wild only pick color
// 4 * wild pick color and draw 4
//tot 108 cards:

type Color = "red" | "yellow" | "blue" | "green" | "wild";

type Value = number | "+4" | "+2" | "new color" | "skip" | "reverse";

// ex: {color: "red", value: 4}
type Card_info = {color: Color, value: Value}; 

// ex {red4: {color: "red", value: 4}}
type Card = {[tag: string]: Card_info};

//ex {red4: {color: "red", value: 4}, blue6: { color: 'blue', value: 6 }}

type Hand = Record<string, Card_info>;

//removing card: by its tag/key

//ex delete player_hand[key];

//adding card to hand: needs tag and card_info:
// player_hand[new_key]

//making a hand, that is easy to pick from, a record with tags as keys and card_info as value
const player_hand: Hand = {};

player_hand["red4"] = {color: "red", value: 4};

//console.log(player_hand);

player_hand["blue6"] = {color: "blue", value: 6};
player_hand["draw4"] = {color: "wild", value: "+4"};
player_hand["green9"] = {color: "green", value: 9};

console.log("color should be wild ==== ", player_hand.draw4.color);
console.log("after adding: ");

//gives number of keys in the record:
console.log(Object.keys(player_hand).length);

//maybe type Card = {[tag: string]: Card_info};
//should have list(Card_info, Card_info) and when a card is picked we only have list(Card_info), 
//and when the last card is picked => list() then remove that key-val from the record. 

//

// type Card = {tag: "blue6", color: "blue", value: 6};

const foobar: Card = {"blue6": {color: "blue", value: 6}};

function add_to_hand(player_hand: Hand, {}: Card) {
    player_hand[c.tag] = 
}
