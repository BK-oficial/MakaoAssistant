export type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type CardSuit = '♥' | '♦' | '♣' | '♠';

export interface Card {
  value: CardValue;
  suit: CardSuit;
}

export interface PlayableCard extends Card {
  effect?: string; // Opis efektu specjalnego
}