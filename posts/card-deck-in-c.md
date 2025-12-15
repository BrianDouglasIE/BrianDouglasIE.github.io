---
title: Card deck in C
tags: [C]
date: 15/12/2025
---

I'm working on a Raylib game in C. It's a Scoundrel clone, which is a card based dungeon crawler.
Anyway, I thought I'd share a code snippet of how I am generating the deck of cards using C.

<!-- more -->

The plan going forward is to have multiple Decks that a user can chose from. For this example _VANILLA_,
is all we need. Email me at the link in the footer if you have suggestions on how it can be improved.
C veterans always have suggestions...

```c
#include "raylib/raylib.h"
#include <stdlib.h>
#include <stdio.h>

#define MAX_CARD_NAME 64U
#define MAX_DECK_NAME 64U
#define MAX_DECK_SIZE 52U

#define SUIT_COUNT 4
#define CARDS_PER_SUIT 13

typedef enum
{
    VANILLA,
} Deck;

typedef enum
{
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES
} Suit;

typedef struct
{
    Deck deck;
    Suit suit;
    int value;
} Card;

const char *get_card_suit_name(Card *c)
{
    char *suit_name = NULL;
    switch(c->suit)
    {
    case CLUBS:
        suit_name = "Clubs";
        break;
    case DIAMONDS:
        suit_name = "Diamonds";
        break;
    case HEARTS:
        suit_name = "Hearts";
        break;
    case SPADES:
        suit_name = "Spades";
        break;
    default:
        suit_name = "ERROR";
    }
    return suit_name;
}

const char *get_card_value_name(Card *c)
{
    char *value_names[] =
    {
        "Ace",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Jack",
        "Queen",
        "King"
    };

    int value = c->value;

    if (value >= 0 && value < 13)
    {
        return value_names[value];
    }
    else
    {
        return "ERROR";
    }
}

void get_card_display_name(Card *c, char *buf, size_t buf_size)
{
    const char *suit_name = get_card_suit_name(c);
    const char *value_name = get_card_value_name(c);

    snprintf(buf, buf_size, "%s of %s", value_name, suit_name);
}

int main(void)
{
    InitWindow(800, 450, "raylib");

    Card card;
    char card_name_buf[MAX_CARD_NAME];

    Card vanilla_deck[MAX_DECK_SIZE];
    for(int i = 0; i < MAX_DECK_SIZE; i++)
    {
        Card c = {VANILLA, (Suit)i % SUIT_COUNT, i % CARDS_PER_SUIT};
        vanilla_deck[i] = c;
    }

    size_t current_card_index = 0;
    while (!WindowShouldClose())
    {
        card = vanilla_deck[current_card_index];
        get_card_display_name(&card, card_name_buf, sizeof(card_name_buf));

        // some garbage code to draw the current card on the screen
        BeginDrawing();
        ClearBackground(RAYWHITE);
        if(IsMouseButtonPressed(MOUSE_LEFT_BUTTON))
        {
            current_card_index++;
            if(current_card_index >= MAX_DECK_SIZE)
            {
                current_card_index = 0;
            }
        }
        DrawText(card_name_buf, 190, 200, 20, LIGHTGRAY);
        EndDrawing();
    }

    CloseWindow();

    return 0;
}
```
