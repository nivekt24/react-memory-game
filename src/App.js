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
  const [firstSelection, setFirstSelection] = useState(null);
  const [secondSelection, setSecondSelection] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [isRunning, setIsRunning] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // restartGame
  const handleRestart = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setFirstSelection(null);
    setSecondSelection(null);
    setCards(shuffledCards);
    setFlips(0);
    setTimeLeft(30); // Reset time
    setIsRunning(false); // Stop the timer
    setShowWinModal(false); // Hide win modal
  };

  // handle a choice
  const handleChoice = (card) => {
    if (!isRunning) {
      setIsRunning(true); // Start the timer when the first card is clicked
    }
    firstSelection ? setSecondSelection(card) : setFirstSelection(card);
  };

  // compare 2 selected cards
  useEffect(() => {
    const handleMatchingCards = () => {
      if (firstSelection.src === secondSelection.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === firstSelection.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    };

    if (firstSelection && secondSelection) {
      setDisabled(true);
      handleMatchingCards();
    }
  }, [firstSelection, secondSelection]);

  // reset choices & increase flips
  const resetTurn = () => {
    setFirstSelection(null);
    setSecondSelection(null);
    setFlips((prevFlips) => prevFlips + 1);
    setDisabled(false);
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0 && !cards.some((card) => !card.matched)) {
      setIsRunning(false); // Stop the timer if all cards are matched
      setShowWinModal(true); // Show win modal
    } else if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleRestart();
    }
  }, [isRunning, timeLeft, cards]);

  useEffect(() => {
    handleRestart();
  }, []);

  return (
    <div className="App">
      <h1>Memory Card</h1>
      <div>
        <p>Time Left: {timeLeft} seconds</p>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstSelection ||
              card === secondSelection ||
              card.matched
            }
            disabled={disabled}
          />
        ))}
      </div>

      <footer>
        <p>Flips: {flips}</p>
        <button onClick={handleRestart}>Restart</button>
      </footer>

      {showWinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>You Won!</h2>
            <p>Congratulations! You matched all the cards!</p>
            <button onClick={handleRestart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
