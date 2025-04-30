import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, MatchFormat, Player } from '../types';
import { createMatch } from '../utils/teamGenerator';

interface MatchContextType {
  currentFormat: MatchFormat;
  setCurrentFormat: (format: MatchFormat) => void;
  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  currentMatch: Match | null;
  generateMatch: () => void;
  savedMatches: Match[];
  saveMatch: (match: Match) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFormat, setCurrentFormat] = useState<MatchFormat>('6v6');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [savedMatches, setSavedMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load saved matches from storage
  useEffect(() => {
    const loadSavedMatches = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedMatches');
        if (savedData) {
          const parsedData: Match[] = JSON.parse(savedData);
          // Convert date string back to Date object
          const matches = parsedData.map(match => ({
            ...match,
            createdAt: new Date(match.createdAt)
          }));
          setSavedMatches(matches);
        }
      } catch (error) {
        setError('Failed to load saved matches. Please try again.');
        console.error('Error loading saved matches:', error);
      }
    };

    loadSavedMatches();
  }, []);

  const addPlayer = (player: Player) => {
    setPlayers([...players, player]);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers(
      players.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
    // Reset current match when a player is removed
    setCurrentMatch(null);
  };

  const generateMatch = () => {
    try {
      const match = createMatch(currentFormat, players);
      setCurrentMatch(match);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate match');
    }
  };

  const saveMatch = async (match: Match) => {
    try {
      const updatedMatches = [...savedMatches, match];
      setSavedMatches(updatedMatches);
      await AsyncStorage.setItem('savedMatches', JSON.stringify(updatedMatches));
      setError(null);
    } catch (error) {
      setError('Failed to save match. Please try again.');
      console.error('Error saving match:', error);
    }
  };

  const deleteMatch = async (matchId: string) => {
    try {
      const updatedMatches = savedMatches.filter((match) => match.id !== matchId);
      setSavedMatches(updatedMatches);
      await AsyncStorage.setItem('savedMatches', JSON.stringify(updatedMatches));
      setError(null);
    } catch (error) {
      setError('Failed to delete match. Please try again.');
      console.error('Error deleting match:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <MatchContext.Provider
      value={{
        currentFormat,
        setCurrentFormat,
        players,
        addPlayer,
        updatePlayer,
        removePlayer,
        currentMatch,
        generateMatch,
        savedMatches,
        saveMatch,
        deleteMatch,
        error,
        clearError,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};