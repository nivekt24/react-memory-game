import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';

const cardImages = [
  { src: '/img/Bulbasaur.png', matched: false },
  { src: '/img/Charmander.png', matched: false },
  { src: '/img/Ditto.png', matched: false },
  { src: '/img/Mew.png', matched: false },
  { src: '/img/Pickachu.png', matched: false },
  { src: '/img/Squirtle.png', matched: false },
];

const App = () => {
  const [cards, setCards] = useState([]);
  const [flips, setFlips] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // restartGame
  const handleRestart = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setFlips(0);
  };

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // compare 2 selected cards
  useEffect(() => {
    const handleMatchingCards = () => {
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    };

    if (choiceOne && choiceTwo) {
      setDisabled(true);
      handleMatchingCards();
    }
  }, [choiceOne, choiceTwo]);

  // reset choices & increase flips
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setFlips((prevFlips) => prevFlips + 1);
    setDisabled(false);
  };

  useEffect(() => {
    handleRestart();
  }, []);

  return (
    <div className="App">
      <h1>Memory Card</h1>

      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>

      <footer>
        <p>Flips: {flips}</p>
        <button onClick={handleRestart}>Restart</button>
      </footer>
    </div>
  );
};

export default App;
