import React, { useState } from 'react';
import axios from 'axios';
import './WordDetails.css';

const WordDetails = () => {
  const [word, setWord] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWordDetails = async () => {
    const API_KEY = 'AIzaSyChqzNsskSqD7GTDZeIOTxPTCyVnpdhX1o';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const prompt = `Provide the following details for the word '${word}': \n    - Definition\n    - Syllables\n    - Phonetic Transcription\n    - Example Sentence\n    - Phonemes\n    Please return the result in a structured JSON`;

    try {
      const response = await axios.post(endpoint, {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      const textContent =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textContent) {
        const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[1]);
          setResponseData(jsonData);
        } else {
          throw new Error('Invalid JSON format in response');
        }
      } else {
        throw new Error('No text content in response');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch word details. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Word Details Finder</h2>
      <div className="input-container">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
        />
        <button onClick={fetchWordDetails}>Fetch Details</button>
      </div>
      {error && <p className="error">{error}</p>}
      {responseData && (
        <div className="word-details">
          <h3>Word Details</h3>
          <ul>
            <li>
              <strong>Word:</strong> <span>{responseData.word}</span>
            </li>
            <li>
              <strong>Definition:</strong> <span>{responseData.definition}</span>
            </li>
            <li>
              <strong>Syllables:</strong> <span>{responseData.syllables}</span>
            </li>
            <li>
              <strong>Phonetic Transcription:</strong>{' '}
              <span>{responseData.phonetic_transcription}</span>
            </li>
            <li>
              <strong>Example Sentence:</strong>{' '}
              <span>{responseData.example_sentence}</span>
            </li>
            <li>
              <strong>Phonemes:</strong>{' '}
              <span>{responseData.phonemes.join(', ')}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WordDetails;
