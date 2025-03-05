import { Pair, pair, list, List, head, tail, is_null, length } from "./lib/list";
import { Queue } from "./lib/queue_array";
import { NonEmptyStack, Stack } from "./lib/stack";

/**
 * the color of a UNO card is represented as a literal type.
 * "red" | "yellow" | "blue" | "green" represent the standard UNO colors.
 * "wild" represents the UNO wild cards.
 */

export type Color = "red" | "yellow" | "blue" | "green" | "wild";

/**
 * The possible value each UNO card can have.
 * 
 * - number: are the numbers (0-9), which represent standard UNO card values.
 * - "+4": wild draw 4, cannot be combined with any color but "wild"
 * - "+2": draw 2.
 * - "new color": wild color change, cannot be combined with any color but "wild"
 * - "skip": skip turn.
 * - "reverse": reverse turn order.
*/

export type Value = number | "+4" | "+2" | "new color" | "skip" | "reverse";

/**
 * Card_info is the information about an UNO card, stored in a record. 
 * each card has the card info:
 * - color: one of the valid UNO colors
 * - value: one of the valid UNO values
 * example:
 * the UNO card (red 4) has the Card_info {color: "red", value: 4}.
 */

export type Card_info = {color: Color, value: Value}; 

/**
 * An UNO card is represented as a Record containing a string and a record.
 * 
 * each card has:
 * - tag: a string which is a concatenation of the color and value of a card
 * - CI: the Card_info for the card. 
 * example: 
 * red4 has the Card {tag: "red 4", CI:{color: "red", value: 4}};
 */

export type Card = {tag: string, CI: Card_info};

/**
 * A hand is a homogeneous record with the following properties:
 * - key: a dynamic string representing the tag of each card. 
 * - value: a list of "Card" records and each record in the list represents one card in the hand. 
 * 
 * example: 
 * const hand = {blue 4: list({ color: 'blue', value: 4 }, { color: 'blue', value: 4 })};
 * //this means that there are two "blue4" cards in the hand. 
 * 
 * const hand = {green 1: list({ color: 'green', value: 1})};
 * //represents a hand with only one card which is "green1".
 */

export type Hand = Record<string, List<Card>>;


//const player_hand: Hand = {"red 4": list({tag: "red 4", CI:{color: "red", value: 4}}, {tag: "red 4", CI:{color: "red", value: 4}})};


/**
 * a deck of UNO cards is represented as a homogeneous Queue where each element is a Card.
 * 
 * - cards are drawn in first in first out order.
 * - the deck starts shuffled
 * example:
 * drawing a card and discarding it from the deck: 
 * const draw_random_card = q_head(game_deck);
 * dequeue(game_deck);
 */

export type Deck = Queue<Card>;

/**
 * A game pile is the homogeneous stack of played UNO cards.
 * 
 * - last played card is at the top of the stack.
 * - cards are added in last in first out order
 * - determines the game state, ie which card color or value can be played. 
 */

export type GamePile = Stack<Card>;

