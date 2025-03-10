import { Card, Card_info, Hand, Color, Value, Deck, GamePile, Mult_hands, Game_state } from "./src/types";

import { make_card, many_enques, make_color, make_wild_card, make_deck, shuffle, random_num } from "./src/deck";

import {
    delete_card_from_hand, add_card_to_hand, dist_cards, add_card_to_gp,
    current_top_card, draw_plus_2_or_4, length_of_hand, refill_deck_from_gp,
    display_hand, check_for_uno, is_winning, start_of_game_dist
} from "./src/game";

import { empty as empty_q, head as q_head, dequeue } from "./lib/queue_array";

import { list, length as list_length, head, is_null } from "./lib/list";

import { empty as empty_s } from "./lib/stack";

import { AI_tags_in_arr, hand_to_card_arr, AI_match_col_or_val } from "./src/ai-logic";

//testing deck.ts
test('testing if make_card function works', () => {
    expect(make_card("red", 4)).toStrictEqual({tag: "red 4", CI: {color: "red", value: 4}});
});

test('random card in a color group has same color as group', () => {
    const test_deck: Deck = empty_q<Card>();
    make_color("yellow", test_deck);
    const rand_index = test_deck[2][random_num(test_deck[0], test_deck[1] - 1)];
    expect(rand_index.CI.color).toBe("yellow");
});

test('check if wild cards function works', () => {
    const test_deck: Deck = empty_q<Card>();
    make_wild_card(test_deck);
    const rand_index = test_deck[2][random_num(test_deck[0], test_deck[1] - 1)];
    expect(rand_index.CI.color).toBe("wild");
});

test('same number of elements in deck after shuffling', () => {
    //first card in q when creating color group is card 1
    const test_deck: Deck = empty_q<Card>();
    make_color("blue", test_deck);
    const len_before = test_deck[2].length;
    shuffle(test_deck);
    const len_after_shuffle = test_deck[2].length;

    expect(len_after_shuffle).toBe(len_before);
});

test('make deck creates 108 cards', () => {
    //first card in q when creating color group is card 1
    const deck_test = make_deck()
    const len = deck_test[2].length
    expect(len).toBe(108);
});

test('adds card to hand', () => {
    const test_hand: Hand = {};
    const test_card1 = make_card("green", 8);
    const test_card2 = make_card("red", "+2");
    add_card_to_hand(test_card1, test_hand);
    add_card_to_hand(test_card2, test_hand);
    const result_hand: Hand = {"green 8": list(make_card("green", 8)),
                               'red +2': list(make_card("red", "+2"))
                               };
    expect(test_hand).toStrictEqual(result_hand);
});

test('adding dupelicate cards creates a list of length 2', () => {
    const test_hand: Hand = {};
    const test_card1 = make_card("green", 8);
    const tagg = test_card1.tag;
    add_card_to_hand(test_card1, test_hand);
    add_card_to_hand(test_card1, test_hand);
    const result_hand: Hand = { "green 8": list(make_card("green", 8), make_card("green", 8))};
    const result_list = result_hand[tagg];
    expect(test_hand[tagg]).toStrictEqual(result_list);
    expect(list_length(test_hand[tagg])).toBe(2);
});

test('remove 2 dupelicate cards removes total card from hand', () => {
    const test_hand: Hand = {};
    const test_card1 = make_card("green", 8);
    const tagg = test_card1.tag;
    add_card_to_hand(test_card1, test_hand);
    add_card_to_hand(test_card1, test_hand);

    delete_card_from_hand(test_card1, test_hand);
    delete_card_from_hand(test_card1, test_hand);

    expect(test_hand[tagg]).toBe(undefined);
});

test('cannot delete card from hand if card is not in the hand', () => {
    const test_hand: Hand = {};
    add_card_to_hand(make_card("red", 5), test_hand);
    add_card_to_hand(make_card("yellow", 0), test_hand);
    const test_card1 = make_card("blue", 2);
    expect(delete_card_from_hand(test_card1, test_hand)).toBe(false);
});

test('test distribution of cards', () => {
    const test_hand: Hand = {};
    const test_deck: Deck = make_deck();
    const initial_deck_len = test_deck[1] - 1;
    dist_cards(test_deck, test_hand, 7);
    expect(length_of_hand(test_hand)).toBe(7);
    const cards_in_deck_after_dist = test_deck[1] - test_deck[0];

    expect(cards_in_deck_after_dist).toBeLessThan(initial_deck_len);
});
//create test for game pile
test('the last added card to the game pile is the current card', () => {
    let game_pile: GamePile = empty_s<Card>();
    const test_card1 = make_card("red", 5);
    const last_added = make_card("green", 1);

    game_pile = add_card_to_gp(last_added, add_card_to_gp(test_card1, game_pile));

    expect(current_top_card(game_pile)).toStrictEqual(last_added);

});

test('draw +2 card for a hand returns the hand plus the added cards', () => {
    const test_hand: Hand = {};
    add_card_to_hand(make_card("blue", 4), test_hand);
    add_card_to_hand(make_card("green", 9), test_hand);
    const len_before_2 = length_of_hand(test_hand);
    draw_plus_2_or_4(make_deck(), test_hand, make_card("green", "+2"));

    expect(length_of_hand(test_hand)).toBe(len_before_2 + 2);
});

test('draw +4 card for a hand returns the hand plus the added cards', () => {
    const test_hand: Hand = {};
    add_card_to_hand(make_card("red", 4), test_hand);
    add_card_to_hand(make_card("yellow", 9), test_hand);
    const len_before_2 = length_of_hand(test_hand);
    draw_plus_2_or_4(make_deck(), test_hand, make_card("blue", "+4"));

    expect(length_of_hand(test_hand)).toBe(len_before_2 + 4);
});

test('refill deck increases queue length, and game pile length is 1 after refill', () => {
    const tez: Deck = make_deck();
    let test_s: GamePile = empty_s<Card>();
    for(let i = 0; i < 10; i++){
        test_s = add_card_to_gp(q_head(tez), test_s);
        dequeue(tez);
    }
    test_s = refill_deck_from_gp(test_s, tez);
    expect(list_length(test_s)).toBe(1);
    const len_q = 108 + 9; //first added 10 cards, and refill 9 cards to deck, 1 left in gamepile
    expect(tez[2].length).toBe(len_q);

});

test('the tags in the display card array are valid for hand', () => {
    const handx: Hand = {};
    const test_blue = make_card("blue", 7);
    add_card_to_hand(test_blue, handx);
    add_card_to_hand(make_card("red", "skip"), handx);
    add_card_to_hand(make_card("yellow", 5), handx);
    const display_arr = display_hand(handx);
    const matches_card_tag = test_blue.tag
    expect(display_arr[0]).toStrictEqual(matches_card_tag);
});

test('check if displaying correct amount of cards', () => {
    const test_hand1: Hand = {};
    add_card_to_hand(make_card("red", 4), test_hand1);
    add_card_to_hand(make_card("red", 4), test_hand1);
    add_card_to_hand(make_card("blue", 9), test_hand1);
    add_card_to_hand(make_card("green", "+2"), test_hand1);
    add_card_to_hand(make_card("green", "+2"), test_hand1);
    const result_arr: Array<string> = display_hand(test_hand1);
    const expected_array = [ 'red 4', 'red 4', 'blue 9', 'green +2', 'green +2' ];

    expect(result_arr).toStrictEqual(expected_array);
    expect(result_arr.length).toBe(5);
});

test('check for uno with hand with length 1 prints uno', () => {
    const tezz: Hand = {};
    add_card_to_hand(make_card("green", 8), tezz)
    expect(check_for_uno(tezz)).toBe(true);
});

test('test if hand has won game', () => {
    const end_hand: Hand = {"red 4": list(make_card("red", 4))};
    delete_card_from_hand(make_card("red", 4), end_hand);
    expect(is_winning(end_hand)).toBe(true);
})

test('turn hand into array with correct amount of cards', () => {
    const hand = {"green 8": list(make_card("green", 8), make_card("green", 8))};
    expect(hand_to_card_arr(hand).length).toBe(2);
});

test('AI matches card from hand with current card', () => {
    const AI_hand: Hand = {};
    const curr_card = make_card("yellow", 7);
    add_card_to_hand(make_card("blue", 1), AI_hand);
    add_card_to_hand(make_card("red", 6), AI_hand);
    add_card_to_hand(make_card("green", "+2"), AI_hand);
    const green_match = make_card("green", "+2");
    const test1 = AI_match_col_or_val(AI_hand, curr_card);
    const test2 = AI_match_col_or_val(AI_hand, make_card("green", 8));

    expect(test1.length).toBe(0);
    expect(test2[0]).toStrictEqual(green_match);
});

test('start of game distribute 7 cards each', () => {
    const handz: Mult_hands = {
        ai_hand: {},
        player_hand: {}
    };
    const test_deck: Deck = make_deck();
    start_of_game_dist(handz, test_deck);
    const hand_len_pl = length_of_hand(handz.player_hand);
    const hand_len_ai = length_of_hand(handz.ai_hand);
    expect(hand_len_pl).toBe(7);
    expect(hand_len_ai).toBe(7);
});