export type MatchFormat = '6v6' | '7v7' | '8v8';

export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  skillLevel: number;
}

export interface Team {
  name: string;
  color: string;
  players: Player[];
}

export interface Match {
  id: string;
  format: MatchFormat;
  createdAt: Date;
  teamA: Team;
  teamB: Team;
}

export interface PositionCount {
  Goalkeeper: number;
  Defender: number;
  Midfielder: number;
  Forward: number;
}

export type FieldPosition = {
  x: number;
  y: number;
  position: PlayerPosition;
  team: 'teamA' | 'teamB';
};

export type FieldPositions = {
  [key in MatchFormat]: {
    teamA: FieldPosition[];
    teamB: FieldPosition[];
  };
};