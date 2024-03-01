import React from 'react';
import './Card.css';

const Card = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className={`card ${card.matched ? 'matched' : ''}`}>
      <div className={flipped ? 'flipped' : ''}>
        <img className="front" src={card.src} alt="card front" />
        <img
          className="back"
          src="/img/pokeball.png"
          onClick={handleClick}
          alt="cover"
        />
      </div>
    </div>
  );
};

export default Card;
