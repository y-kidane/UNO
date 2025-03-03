import { Card, Card_info, Hand, Color, Value, Deck, GamePile } from "./types";
import { make_card, many_enques, make_color, make_wild_card, make_deck, shuffle, random_num } from "./deck";
import { delete_card_from_hand, add_card_to_hand, dist_cards, add_card_to_gp, current_card, draw_plus, length_of_hand } from "./game";
import { empty as empty_q, head as q_head } from "./lib/queue_array";
import { list, length, head } from "./lib/list";

//testing deck.ts
test('testing if make_card function works', () => {
    expect(make_card("red", 4)).toStrictEqual({tag: "red4", CI: {color: "red", value: 4}});
});

test('random card in a color group has same color as group', () => {
    const test_deck: Deck = empty_q<Card>();
    make_color("yellow", test_deck);
    const rand_index = test_deck[2][random_num(test_deck[1] - 1)];
    expect(rand_index.CI.color).toBe("yellow");
});

test('check if wild cards function works', () => {
    const test_deck: Deck = empty_q<Card>();
    make_wild_card(test_deck);
    const rand_index = test_deck[2][random_num(test_deck[1] - 1)];
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

//testing game.ts

// test('', () => {
//     expect().toBe();
// });

// card = { tag: 'red6', CI: { color: 'red', value: 6 } }

test('adds card to hand', () => {
    const test_hand: Hand = {};
    const test_card1 = make_card("green", 8);
    const test_card2 = make_card("red", "+2");
    add_card_to_hand(test_card1, test_hand);
    add_card_to_hand(test_card2, test_hand);
    const result_hand: Hand = {"green8": [ { color: 'green', value: 8 }, null ],
                               'red+2': [ { color: 'red', value: '+2' }, null ]
                               } 
    expect(test_hand).toStrictEqual(result_hand);
});

test('adding dupelicate cards creates a list of length 2', () => {
    const test_hand: Hand = {};
    const test_card1 = make_card("green", 8);
    const tagg = test_card1.tag;
    add_card_to_hand(test_card1, test_hand);
    add_card_to_hand(test_card1, test_hand);
    const result_hand: Hand = { green8: list({ color: 'green', value: 8 }, { color: 'green', value: 8 })};
    const result_list = result_hand[tagg];
    expect(test_hand[tagg]).toStrictEqual(result_list);
    expect(length(test_hand[tagg])).toBe(2);
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
test('', () => {

})