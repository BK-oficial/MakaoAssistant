<template>
  <div class="makao-assistant-container">
    <header class="header">
      <h1><span style="color: #e74c3c;">♠</span> Asystent do Makao <span style="color: #e74c3c;">♥</span></h1>
      <p class="subtitle">Wybierz karty i sprawdź możliwe ruchy</p>
    </header>

    <div class="game-section">
      <!-- Karta na stole -->
      <div class="card-input-section">
        <label class="input-label">Karta na stole:</label>
        <div class="card-selector">
          <select v-model="currentCard.value" class="card-select">
            <option v-for="value in cardValues" :key="value" :value="value">{{ value }}</option>
          </select>
          <select v-model="currentCard.suit" class="card-select">
            <option v-for="suit in cardSuits" :key="suit" :value="suit">{{ suit }}</option>
          </select>
        </div>
        <div class="current-card-display">
          <span class="card-preview" :class="suitColorClass(currentCard.suit)">
            {{ currentCard.value }}{{ currentCard.suit }}
          </span>
        </div>
      </div>

      <!-- Interaktywna selekcja kart -->
      <div class="player-cards-section">
        <label class="input-label">Twoje karty:</label>
        
        <!-- Siatka wyboru kart -->
        <div class="card-buttons-grid">
          <div v-for="value in cardValues" :key="value" class="value-column">
            <div class="value-header">{{ value }}</div>
            <button
              v-for="suit in cardSuits"
              :key="suit"
              @click="toggleCard(value, suit)"
              :class="{
                'card-button': true,
                'selected': isCardSelected(value, suit),
                [suitColorClass(suit)]: true
              }"
            >
              {{ value }}{{ suit }}
            </button>
          </div>
        </div>

        <!-- Podgląd wybranych kart -->
        <div class="selected-cards-display">
          <h3>Wybrane karty:</h3>
          <div v-if="selectedCards.length > 0" class="selected-cards-list">
            <span v-for="card in selectedCards" :key="`${card.value}${card.suit}`" 
                  class="selected-card" :class="suitColorClass(card.suit)">
              {{ card.value }}{{ card.suit }}
              <button @click="removeCard(card)" class="remove-card-btn">×</button>
            </span>
          </div>
          <p v-else class="no-cards-info">(Kliknij karty aby dodać)</p>
        </div>
      </div>

      <button @click="calculateMoves" class="calculate-button">
        Sprawdź możliwe ruchy
      </button>

      <!-- Wyniki -->
      <div v-if="playableCards.length > 0" class="results-section">
        <h2 class="results-title">Możliwe ruchy:</h2>
        <div class="results-grid">
          <div v-for="card in playableCards" :key="`${card.value}${card.suit}`" class="card-result">
            <div class="card-display" :class="suitColorClass(card.suit)">
              {{ card.value }}{{ card.suit }}
            </div>
            <div v-if="card.effect" class="special-effect">
              <div class="effect-icon">⚡</div>
              <div class="effect-text">{{ card.effect }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <p>Specjalne funkcje kart:</p>
      <ul class="rules-list">
        <li><strong>Walet (J)</strong>: Żądanie wartości</li>
        <li><strong>As (A)</strong>: Żądanie koloru</li>
        <li><strong>Król kier (K♥)</strong>: +5 kart</li>
        <li><strong>Dwójka (2)</strong>: +2 karty</li>
      </ul>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type CardSuit = '♥' | '♦' | '♣' | '♠';

interface Card {
  value: CardValue;
  suit: CardSuit;
}

interface PlayableCard extends Card {
  effect?: string;
}

export default defineComponent({
  data() {
    return {
      cardValues: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as CardValue[],
      cardSuits: ['♥', '♦', '♣', '♠'] as CardSuit[],
      currentCard: { value: '6', suit: '♥' } as Card,
      selectedCards: [] as Card[],
      playableCards: [] as PlayableCard[],
    };
  },
  methods: {
    suitColorClass(suit: CardSuit): string {
      return suit === '♥' || suit === '♦' ? 'red-suit' : 'black-suit';
    },
    toggleCard(value: CardValue, suit: CardSuit) {
      const card = { value, suit };
      const index = this.selectedCards.findIndex(c => 
        c.value === value && c.suit === suit
      );
      
      if (index === -1) {
        this.selectedCards.push(card);
      } else {
        this.selectedCards.splice(index, 1);
      }
    },
    isCardSelected(value: CardValue, suit: CardSuit): boolean {
      return this.selectedCards.some(c => 
        c.value === value && c.suit === suit
      );
    },
    removeCard(cardToRemove: Card) {
      this.selectedCards = this.selectedCards.filter(card => 
        !(card.value === cardToRemove.value && card.suit === cardToRemove.suit)
      );
    },
    calculateMoves() {
      this.playableCards = this.selectedCards
        .filter(card => 
          card.value === this.currentCard.value || 
          card.suit === this.currentCard.suit || 
          card.value === 'J'
        )
        .map(card => {
          const playableCard: PlayableCard = { ...card };
          
          if (card.value === '2') playableCard.effect = 'Następny gracz bierze 2 karty';
          else if (card.value === 'K' && card.suit === '♥') playableCard.effect = 'Następny gracz bierze 5 kart';
          else if (card.value === 'J') playableCard.effect = 'Żądaj wartości (np. "gram na 7")';
          else if (card.value === 'A') playableCard.effect = 'Żądaj koloru';
          
          return playableCard;
        });
    },
  },
});
</script>

<style>
.makao-assistant-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.game-section {
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card-input-section, .player-cards-section {
  margin-bottom: 25px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 1.1rem;
}

.card-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.card-select {
  padding: 12px 15px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  width: 100px;
}

.current-card-display {
  margin-top: 10px;
}

.card-preview {
  display: inline-block;
  padding: 12px 20px;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: white;
}

.card-buttons-grid {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding: 10px 0;
}

.value-column {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 45px;
}

.value-header {
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.card-button {
  padding: 8px 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  text-align: center;
  background-color: white;
}

.card-button:hover {
  transform: scale(1.05);
}

.card-button.selected {
  font-weight: bold;
  border: 2px solid #3498db;
  background-color: #e6f7ff;
}

.selected-cards-display {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.selected-cards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.selected-card {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #eee;
  font-weight: bold;
}

.remove-card-btn {
  margin-left: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-weight: bold;
}

.remove-card-btn:hover {
  color: #e74c3c;
}

.no-cards-info {
  color: #999;
  font-style: italic;
  margin-top: 10px;
}

.calculate-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 14px 25px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
  margin-top: 10px;
  margin-bottom: 20px;
}

.calculate-button:hover {
  background-color: #27ae60;
}

.results-section {
  margin-top: 30px;
}

.results-title {
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
  color: #2c3e50;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card-result {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card-display {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee;
}

.special-effect {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: #f0f8ff;
  border-radius: 5px;
  font-size: 0.95rem;
}

.effect-icon {
  font-size: 1.2rem;
}

.footer {
  margin-top: 40px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
}

.rules-list {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.rules-list li {
  padding: 5px 0;
  font-size: 0.95rem;
}

.black-suit {
  color: #333;
}

.red-suit {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .card-buttons-grid {
    gap: 3px;
  }
  
  .value-column {
    min-width: 40px;
  }
}
</style>
