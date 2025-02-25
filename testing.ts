//red, green, blue, yellow: 2 * (1-9, skip, reverse, +2) 
//  one 0 in each color
// 4 *  wild only pick color
// 4 * wild pick color and draw 4
//tot 108 cards:

//making a hand, that is easy to pick from, a record with tags as keys and card_info as value
const player_hand: Hand = {};

player_hand["red4"] = {color: "red", value: 4};

//console.log(player_hand);

player_hand["blue6"] = {color: "blue", value: 6};
player_hand["draw4"] = {color: "wild", value: "+4"};
player_hand["green9"] = {color: "green", value: 9};

console.log(player_hand.draw4.value);

// console.log("color should be wild ==== ", player_hand.draw4.color);
// console.log("after adding: ");

//gives number of keys in the record:

//console.log(Object.keys(player_hand).length);

//maybe type Card = {[tag: string]: Card_info};
//should have list(Card_info, Card_info) and when a card is picked we only have list(Card_info), 
//and when the last card is picked => list() then remove that key-val from the record. 

//

// type Card = {tag: "blue6", color: "blue", value: 6};

