import { Match, MatchFormat, Player, PlayerPosition, Team } from '../types';
import { POSITION_DISTRIBUTION, TEAM_COLORS } from './constants';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Check if the player distribution meets the requirements
export const validatePlayerDistribution = (
  players: Player[],
  format: MatchFormat
): boolean => {
  const distribution = POSITION_DISTRIBUTION[format];
  const positions = Object.keys(distribution) as PlayerPosition[];

  const counts: Record<PlayerPosition, number> = {
    Goalkeeper: 0,
    Defender: 0,
    Midfielder: 0,
    Forward: 0,
  };

  players.forEach((player) => {
    counts[player.position]++;
  });

  return positions.every((position) => {
    return counts[position] >= distribution[position] * 2;
  });
};

// Function to create balanced teams
export const generateTeams = (
  players: Player[],
  format: MatchFormat
): { teamA: Team; teamB: Team } => {
  // Initialize teams
  const teamA: Team = {
    name: 'Team A',
    color: TEAM_COLORS.teamA,
    players: [],
  };

  const teamB: Team = {
    name: 'Team B',
    color: TEAM_COLORS.teamB,
    players: [],
  };

  // Group players by position
  const playersByPosition: Record<PlayerPosition, Player[]> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: [],
  };

  // Sort players into position groups
  players.forEach((player) => {
    playersByPosition[player.position].push({ ...player });
  });

  // Sort each position group by skill level
  Object.values(playersByPosition).forEach((positionPlayers) => {
    positionPlayers.sort((a, b) => b.skillLevel - a.skillLevel);
  });

  // Distribution requirements
  const distribution = POSITION_DISTRIBUTION[format];

  // Helper function to calculate team strength
  const getTeamStrength = (team: Team): number => {
    if (team.players.length === 0) return 0;
    return team.players.reduce((sum, p) => sum + p.skillLevel, 0) / team.players.length;
  };

  // Distribute goalkeepers first (one to each team)
  const goalkeepers = playersByPosition.Goalkeeper;
  if (goalkeepers.length >= 2) {
    // Randomly decide which team gets the first goalkeeper
    if (Math.random() < 0.5) {
      teamA.players.push(goalkeepers[0]);
      teamB.players.push(goalkeepers[1]);
    } else {
      teamB.players.push(goalkeepers[0]);
      teamA.players.push(goalkeepers[1]);
    }
  }

  // Distribute other positions
  ['Defender', 'Midfielder', 'Forward'].forEach((position) => {
    const positionPlayers = playersByPosition[position as PlayerPosition];
    const count = distribution[position as PlayerPosition];

    // Create pairs of players with similar skill levels
    for (let i = 0; i < Math.min(count * 2, positionPlayers.length); i += 2) {
      const player1 = positionPlayers[i];
      const player2 = positionPlayers[i + 1];

      if (!player1) continue;

      if (!player2) {
        // If we have an odd number of players, assign based on team strength
        const teamAStrength = getTeamStrength(teamA);
        const teamBStrength = getTeamStrength(teamB);
        if (teamAStrength <= teamBStrength) {
          teamA.players.push(player1);
        } else {
          teamB.players.push(player1);
        }
        continue;
      }

      // Assign pair of players to balance teams
      const teamAStrength = getTeamStrength(teamA);
      const teamBStrength = getTeamStrength(teamB);

      if (teamAStrength <= teamBStrength) {
        teamA.players.push(player1);
        teamB.players.push(player2);
      } else {
        teamB.players.push(player1);
        teamA.players.push(player2);
      }
    }
  });

  // Sort players within teams by position
  const positionOrder: PlayerPosition[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  
  teamA.players.sort((a, b) => 
    positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  );
  
  teamB.players.sort((a, b) => 
    positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  );

  return { teamA, teamB };
};

// Create a new match
export const createMatch = (
  format: MatchFormat,
  players: Player[]
): Match => {
  const { teamA, teamB } = generateTeams(players, format);
  
  return {
    id: generateId(),
    format,
    createdAt: new Date(),
    teamA,
    teamB,
  };
};