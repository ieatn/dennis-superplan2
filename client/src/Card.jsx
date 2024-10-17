import React, { useState } from 'react'
import './App.css'

export default function Card({ frontText, backText, onDragStart }) {
  const [flip, setFlip] = useState(false)

  const handleFlip = () => {
    setFlip(!flip)
  }

  const cardStyle = {
    width: '150px',
    height: '200px',
    perspective: '1000px',
    cursor: 'pointer',
  }

  const cardInnerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    transform: flip ? 'rotateY(180deg)' : '',
  }

  const cardFaceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  }

  const cardFrontStyle = {
    ...cardFaceStyle,
    backgroundColor: '#f8f8f8',
  }

  const cardBackStyle = {
    ...cardFaceStyle,
    backgroundColor: '#e8e8e8',
    transform: 'rotateY(180deg)',
  }

  return (
    <div style={cardStyle} onClick={handleFlip} draggable="true" onDragStart={onDragStart}>
      <div style={cardInnerStyle}>
        <div style={cardFrontStyle}>
          <p>{frontText}</p>
        </div>
        <div style={cardBackStyle}>
          <p>{backText}</p>
        </div>
      </div>
    </div>
  )
}
