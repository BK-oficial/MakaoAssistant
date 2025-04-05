<template>
    <div class="makao-assistant">
      <h1>Asystent do Makao 🃏</h1>
      
      <!-- Input: Karta na stole -->
      <div class="input-group">
        <label>Aktualna karta na stole:</label>
        <select v-model="currentCard.value">
          <option v-for="value in cardValues" :key="value">{{ value }}</option>
        </select>
        <select v-model="currentCard.suit">
          <option v-for="suit in cardSuits" :key="suit">{{ suit }}</option>
        </select>
      </div>
  
      <!-- Input: Karty gracza -->
      <div class="input-group">
        <label>Twoje karty (oddziel przecinkami, np. "K♥, J♠"):</label>
        <input v-model="playerCardsInput" placeholder="Wpisz swoje karty"/>
      </div>
  
      <button @click="calculateMoves">Sprawdź możliwe ruchy</button>
  
      <!-- Wynik -->
      <div v-if="playableCards.length > 0" class="result">
        <h2>Możliwe ruchy:</h2>
        <ul>
          <li v-for="card in playableCards" :key="`${card.value}${card.suit}`">
            {{ card.value }}{{ card.suit }} 
            <span v-if="card.effect" class="effect">→ {{ card.effect }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { Card, CardValue, CardSuit, PlayableCard } from '../types/types';
  
  export default defineComponent({
    data() {
      return {
        cardValues: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as CardValue[],
        cardSuits: ['♥', '♦', '♣', '♠'] as CardSuit[],
        currentCard: { value: '6', suit: '♥' } as Card,
        playerCardsInput: '',
        playableCards: [] as PlayableCard[],
      };
    },
    methods: {
      parseCards(input: string): Card[] {
        return input.split(',')
          .map(s => s.trim())
          .filter(s => s.length >= 2)
          .map(s => ({
            value: s.slice(0, -1) as CardValue,
            suit: s.slice(-1) as CardSuit,
          }));
      },
      calculateMoves() {
        const playerCards = this.parseCards(this.playerCardsInput);
        this.playableCards = playerCards
          .filter(card => 
            card.value === this.currentCard.value || 
            card.suit === this.currentCard.suit || 
            card.value === 'J' // Walet jest zawsze legalny
          )
          .map(card => {
            const playableCard: PlayableCard = { ...card };
            
            // Efekty specjalne
            if (card.value === '2') playableCard.effect = 'Następny gracz bierze 2 karty';
            if (card.value === 'K' && card.suit === '♥') playableCard.effect = 'Następny gracz bierze 5 kart';
            if (card.value === 'J') playableCard.effect = 'Możesz zażądać wartości (np. "gram na 7")';
            if (card.value === 'A') playableCard.effect = 'Możesz zażądać koloru';
            
            return playableCard;
          });
      },
    },
  });
  </script>
  
  <style scoped>
  .makao-assistant {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .input-group {
    margin-bottom: 15px;
  }
  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
  }
  .effect {
    color: #d63333;
    font-weight: bold;
  }
  </style>