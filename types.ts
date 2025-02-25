//card can have either a color or wild(black)
type Color = "red" | "yellow" | "blue" | "green" | "wild";

//value could be either of these:
type Value = number | "+4" | "+2" | "new color" | "skip" | "reverse";

// ex: {color: "red", value: 4}
type Card_info = {color: Color, value: Value}; 

// ex {red4: {color: "red", value: 4}}
//     = key      =value
type Card = {[tag: string]: Card_info};

//ex {red4: {color: "red", value: 4}, 
//    blue6: { color: 'blue', value: 6 }}

type Hand = Record<string, Card_info>;

//removing card: by its tag/key

//ex delete player_hand[key];

//adding card to hand: needs tag and card_info:
// player_hand[new_key]