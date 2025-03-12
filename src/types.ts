import { List,} from "../lib/list";
import { Queue } from "../lib/queue_array";
import { Stack } from "../lib/stack";

/**
 * the color of a UNO card is represented as a literal type.
 * "red" | "yellow" | "blue" | "green" represent the standard UNO colors.
 * "wild" represents the UNO wild cards.
 * All cards must atleast have one of these colors.
 */

export type Color = "red" | "yellow" | "blue" | "green" | "wild";

/**
 * The possible value each UNO card can have.
 *
 * - number: are the numbers (0-9) which are the standard UNO cards and
 * is combined with standard colors.
 *
 * - "+2": draw 2. effect: next player in turn gets to draw 2 cards and forefeit turn.
 * is combined with standard colors.
 *
 * - "skip": skip turn. effect: next player in turn has to forfeit their turn.
 * is combined with standard colors.
 *
 * - "reverse": reverse turn order. effect: same effect as skip because
 * there are only 2 players in this program. is combined with standard colors.
 *
 *  - "+4": wild draw 4. effect: player who placed card chooses new color for discard pile
 * and next player in turn gets to draw 4 cards and forefeit turn.
 * only valid color for draw 4 is "wild"
 *
 * - "new-color": wild new color. effect: player who placed card chooses new color for the discard pile.
 * only valid color for new-color is "wild"
*/

export type Value = number | "+4" | "+2" | "new-color" | "skip" | "reverse";

/**
 * Card_info is the information about an UNO card, stored in a record.
 * each Card_info has fields:
 * - color: the color of a UNO card, one of the colors in Colors type
 * - value: the value of a UNO card, one of the values in Value type
 * example:
 * the UNO card "red 4" has the Card_info {color: "red", value: 4}.
 */

export type Card_info = {color: Color, value: Value};

/**
 * An UNO card is represented as a Record containing two fields
 *
 * each card has:
 * - tag: a string which is a concatenation of the color and value of a UNO card
 * - CI: the Card_info for the card.
 * example:
 * the card "red 4" is represented by the Card: {tag: "red 4", CI:{color: "red", value: 4}};
 */

export type Card = {tag: string, CI: Card_info};

/**
 * A hand is a record with one field and has the following properties:
 * - tag: a string representing the tag of each card.
 * - value: a list of "Card" records and each record in the list represents one card in a hand.
 *
 * example:
 * const hand = {"red 4": list({tag: "red 4", CI:{color: "red", value: 4}},
 *                             {tag: "red 4", CI:{color: "red", value: 4}})};
 * - this means that there are two "red 4" cards in the hand.
 *
 * const hand = {"red 4": list({tag: "red 4", CI:{color: "red", value: 4}}),
 *               "green 8": list({tag: "green 8", CI:{color: "green", value: 8}})};
 * //represents a hand with the 2 cards "red 4" and "green 8"
 */

export type Hand = {[tag: string]: List<Card>};


/**
 * a deck of UNO cards is represented as a Queue where each element is a Card.
 *
 * - cards from deck are drawn in first in first out order.
 * - the game deck is a queue where all elements have been shuffled
 * example:
 * drawing a card and discarding it from the deck:
 * const draw_random_card = q_head(game_deck);
 * dequeue(game_deck);
 */



export type Deck = Queue<Card>;

/**
 * A game pile is the stack of played UNO cards.
 *
 * - last played card is at the top of the stack.
 * - cards are added in last in first out order
 * - last played card determines the game state,
 *   ie which card color or value can be played.
 */

export type GamePile = Stack<Card>;


/**
 * a record that has two fields representing two diffrent hands
 */
export type Mult_hands = {ai_hand: Hand, player_hand: Hand};

/**
 * game state represents the overall state of the game
 * where all information about the current game is in one record.
 *
 * - all_hands: a record containing the hands of players
 *
 * - game_deck: the game deck that players draw UNO cards from.
 *
 * - game_pile: the discard pile of an UNO game
 *
 * - current_turn: a variable with union type,
 *   whose value represents whose turn it is in a game of UNO.
 *
 * - current_color: represent the color of a card which
 *   can be played in a game of UNO. optional field and
 *   can be added after creation
 *
 * - is_game_over: a variable with a boolean value to
 *   represent if a UNO game should be ended or continued.
 *
 */
export type Game_state = {
    all_hands: Mult_hands,
    game_deck: Deck,
    game_pile: GamePile,
    current_turn: "player" | "ai",
    current_color?: string
    is_game_over: boolean
}