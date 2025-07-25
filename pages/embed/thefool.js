// pages/embed/thefool.js
import React from 'react';
import CommunitySuggestions from '@/components/CommunitySuggestions';

export default function TheFoolEmbed() {
  return (
    <div style={{
      backgroundColor: '#111',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '2rem',
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <h2>🎧 Community Suggestions for The Fool</h2>
      <p>Submit your songs, sounds, or sonic visions for this card:</p>
      <CommunitySuggestions cardSlug="thefool" />
    </div>
  );
}
