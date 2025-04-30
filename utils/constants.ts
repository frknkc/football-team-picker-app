import { FieldPositions, MatchFormat } from '../types';

export const TEAM_COLORS = {
  teamA: '#ff4d4d', // Red
  teamB: '#4d79ff', // Blue
};

export const POSITION_COLORS = {
  Goalkeeper: '#ffcc00', // Yellow
  Defender: '#00cc66', // Green
  Midfielder: '#cc66ff', // Purple
  Forward: '#ff6600', // Orange
};

export const getTeamSize = (format: MatchFormat): number => {
  switch (format) {
    case '6v6':
      return 6;
    case '7v7':
      return 7;
    case '8v8':
      return 8;
    default:
      return 6;
  }
};

export const FIELD_POSITIONS: FieldPositions = {
  '6v6': {
    teamA: [
      // Goalkeeper
      { x: 10, y: 50, position: 'Goalkeeper', team: 'teamA' },
      // Defenders
      { x: 25, y: 30, position: 'Defender', team: 'teamA' },
      { x: 25, y: 70, position: 'Defender', team: 'teamA' },
      // Midfielders
      { x: 40, y: 30, position: 'Midfielder', team: 'teamA' },
      { x: 40, y: 70, position: 'Midfielder', team: 'teamA' },
      // Forward
      { x: 55, y: 50, position: 'Forward', team: 'teamA' },
    ],
    teamB: [
      // Goalkeeper
      { x: 90, y: 50, position: 'Goalkeeper', team: 'teamB' },
      // Defenders
      { x: 75, y: 30, position: 'Defender', team: 'teamB' },
      { x: 75, y: 70, position: 'Defender', team: 'teamB' },
      // Midfielders
      { x: 60, y: 30, position: 'Midfielder', team: 'teamB' },
      { x: 60, y: 70, position: 'Midfielder', team: 'teamB' },
      // Forward
      { x: 45, y: 50, position: 'Forward', team: 'teamB' },
    ],
  },
  '7v7': {
    teamA: [
      // Goalkeeper
      { x: 10, y: 50, position: 'Goalkeeper', team: 'teamA' },
      // Defenders
      { x: 25, y: 25, position: 'Defender', team: 'teamA' },
      { x: 25, y: 50, position: 'Defender', team: 'teamA' },
      { x: 25, y: 75, position: 'Defender', team: 'teamA' },
      // Midfielders
      { x: 40, y: 35, position: 'Midfielder', team: 'teamA' },
      { x: 40, y: 65, position: 'Midfielder', team: 'teamA' },
      // Forward
      { x: 55, y: 50, position: 'Forward', team: 'teamA' },
    ],
    teamB: [
      // Goalkeeper
      { x: 90, y: 50, position: 'Goalkeeper', team: 'teamB' },
      // Defenders
      { x: 75, y: 25, position: 'Defender', team: 'teamB' },
      { x: 75, y: 50, position: 'Defender', team: 'teamB' },
      { x: 75, y: 75, position: 'Defender', team: 'teamB' },
      // Midfielders
      { x: 60, y: 35, position: 'Midfielder', team: 'teamB' },
      { x: 60, y: 65, position: 'Midfielder', team: 'teamB' },
      // Forward
      { x: 45, y: 50, position: 'Forward', team: 'teamB' },
    ],
  },
  '8v8': {
    teamA: [
      // Goalkeeper
      { x: 10, y: 50, position: 'Goalkeeper', team: 'teamA' },
      // Defenders
      { x: 25, y: 25, position: 'Defender', team: 'teamA' },
      { x: 25, y: 50, position: 'Defender', team: 'teamA' },
      { x: 25, y: 75, position: 'Defender', team: 'teamA' },
      // Midfielders
      { x: 40, y: 30, position: 'Midfielder', team: 'teamA' },
      { x: 40, y: 50, position: 'Midfielder', team: 'teamA' },
      { x: 40, y: 70, position: 'Midfielder', team: 'teamA' },
      // Forward
      { x: 55, y: 50, position: 'Forward', team: 'teamA' },
    ],
    teamB: [
      // Goalkeeper
      { x: 90, y: 50, position: 'Goalkeeper', team: 'teamB' },
      // Defenders
      { x: 75, y: 25, position: 'Defender', team: 'teamB' },
      { x: 75, y: 50, position: 'Defender', team: 'teamB' },
      { x: 75, y: 75, position: 'Defender', team: 'teamB' },
      // Midfielders
      { x: 60, y: 30, position: 'Midfielder', team: 'teamB' },
      { x: 60, y: 50, position: 'Midfielder', team: 'teamB' },
      { x: 60, y: 70, position: 'Midfielder', team: 'teamB' },
      // Forward
      { x: 45, y: 50, position: 'Forward', team: 'teamB' },
    ],
  },
};

export const POSITION_DISTRIBUTION = {
  '6v6': {
    Goalkeeper: 1,
    Defender: 2,
    Midfielder: 2,
    Forward: 1,
  },
  '7v7': {
    Goalkeeper: 1,
    Defender: 3,
    Midfielder: 2,
    Forward: 1,
  },
  '8v8': {
    Goalkeeper: 1,
    Defender: 3,
    Midfielder: 3,
    Forward: 1,
  },
};

export const SKILL_LEVELS = [1, 2, 3, 4, 5];