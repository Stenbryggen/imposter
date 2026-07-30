const { pickWord } = require('./words');

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // undgår forvekslelige tegn (I,O,0,1)
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const MAX_NAME_LENGTH = 20;

const rooms = new Map(); // code -> room
const socketToRoom = new Map(); // socketId -> code

function generateCode() {
  let code;
  do {
    code = Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function validateName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) throw new Error('Indtast et navn.');
  if (trimmed.length > MAX_NAME_LENGTH) throw new Error(`Navnet må højst være ${MAX_NAME_LENGTH} tegn.`);
  return trimmed;
}

function requireRoom(code) {
  const room = rooms.get(code);
  if (!room) throw new Error('Rummet findes ikke.');
  return room;
}

function requireHost(room, socketId) {
  if (room.hostId !== socketId) throw new Error('Kun værten kan gøre det.');
}

function roomCodeFor(socketId) {
  return socketToRoom.get(socketId) || null;
}

function getRoomBySocket(socketId) {
  const code = socketToRoom.get(socketId);
  return code ? rooms.get(code) : null;
}

function createRoom(hostId, hostName) {
  const name = validateName(hostName);
  const code = generateCode();
  const room = {
    code,
    hostId,
    players: [{ id: hostId, name, connected: true }],
    phase: 'LOBBY',
    category: null,
    word: null,
    imposterId: null,
    turnOrder: [],
    currentTurnIndex: 0,
    clues: [],
    votes: {},
    lastResult: null,
  };
  rooms.set(code, room);
  socketToRoom.set(hostId, code);
  return room;
}

function joinRoom(code, socketId, name) {
  const playerName = validateName(name);
  const room = requireRoom((code || '').trim().toUpperCase());
  if (room.phase !== 'LOBBY') throw new Error('Spillet er allerede i gang i det rum.');
  if (room.players.length >= MAX_PLAYERS) throw new Error('Rummet er fyldt op.');
  if (room.players.some((p) => p.name.toLowerCase() === playerName.toLowerCase())) {
    throw new Error('Det navn er allerede taget i dette rum.');
  }
  room.players.push({ id: socketId, name: playerName, connected: true });
  socketToRoom.set(socketId, room.code);
  return room;
}

function startGame(code, requesterId) {
  const room = requireRoom(code);
  requireHost(room, requesterId);
  if (room.players.length < MIN_PLAYERS) {
    throw new Error(`Der skal mindst ${MIN_PLAYERS} spillere til at starte.`);
  }
  const { category, word } = pickWord();
  room.category = category;
  room.word = word;
  room.turnOrder = shuffle(room.players.map((p) => p.id));
  room.imposterId = room.turnOrder[Math.floor(Math.random() * room.turnOrder.length)];
  room.currentTurnIndex = 0;
  room.clues = [];
  room.votes = {};
  room.lastResult = null;
  room.phase = 'CLUES';
  return room;
}

function submitClue(code, socketId, clue) {
  const room = requireRoom(code);
  if (room.phase !== 'CLUES') throw new Error('Der tages ikke imod hints lige nu.');
  const currentTurnId = room.turnOrder[room.currentTurnIndex];
  if (currentTurnId !== socketId) throw new Error('Det er ikke din tur endnu.');
  const trimmed = (clue || '').trim();
  if (!trimmed) throw new Error('Skriv et hint.');
  if (trimmed.length > 30) throw new Error('Hintet må højst være 30 tegn.');
  const player = room.players.find((p) => p.id === socketId);
  room.clues.push({ playerId: socketId, name: player.name, clue: trimmed });
  room.currentTurnIndex += 1;
  if (room.currentTurnIndex >= room.turnOrder.length) {
    room.phase = 'VOTING';
  }
  return room;
}

function tallyVotes(room) {
  const counts = {};
  for (const votedId of Object.values(room.votes)) {
    counts[votedId] = (counts[votedId] || 0) + 1;
  }
  let topIds = [];
  let topCount = -1;
  for (const [id, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCount = count;
      topIds = [id];
    } else if (count === topCount) {
      topIds.push(id);
    }
  }
  const accusedId = topIds[Math.floor(Math.random() * topIds.length)];
  return { accusedId, counts };
}

function resolveVotesIfComplete(room) {
  if (room.phase !== 'VOTING') return;
  if (Object.keys(room.votes).length < room.players.length) return;

  const { accusedId, counts } = tallyVotes(room);
  const accused = room.players.find((p) => p.id === accusedId);
  const wasImposter = accusedId === room.imposterId;
  room.lastResult = {
    accusedId,
    accusedName: accused ? accused.name : 'Ukendt',
    wasImposter,
    voteCounts: counts,
    imposterGuess: null,
    imposterGuessCorrect: null,
    winner: wasImposter ? null : 'imposter',
  };
  room.phase = wasImposter ? 'IMPOSTER_GUESS' : 'RESULT';
}

function submitVote(code, voterId, votedId) {
  const room = requireRoom(code);
  if (room.phase !== 'VOTING') throw new Error('Der stemmes ikke lige nu.');
  if (voterId === votedId) throw new Error('Du kan ikke stemme på dig selv.');
  if (!room.players.some((p) => p.id === votedId)) throw new Error('Ugyldig spiller.');
  room.votes[voterId] = votedId;
  resolveVotesIfComplete(room);
  return room;
}

function imposterGuess(code, socketId, guess) {
  const room = requireRoom(code);
  if (room.phase !== 'IMPOSTER_GUESS') throw new Error('Der gættes ikke lige nu.');
  if (room.imposterId !== socketId) throw new Error('Kun imposteren kan gætte.');
  const normalize = (s) => (s || '').trim().toLowerCase();
  const correct = normalize(guess) === normalize(room.word);
  room.lastResult.imposterGuess = (guess || '').trim();
  room.lastResult.imposterGuessCorrect = correct;
  room.lastResult.winner = correct ? 'imposter' : 'players';
  room.phase = 'RESULT';
  return room;
}

function playAgain(code, requesterId) {
  const room = requireRoom(code);
  requireHost(room, requesterId);
  room.phase = 'LOBBY';
  room.category = null;
  room.word = null;
  room.imposterId = null;
  room.turnOrder = [];
  room.currentTurnIndex = 0;
  room.clues = [];
  room.votes = {};
  room.lastResult = null;
  return room;
}

function resetToLobby(room, notice) {
  room.phase = 'LOBBY';
  room.category = null;
  room.word = null;
  room.imposterId = null;
  room.turnOrder = [];
  room.currentTurnIndex = 0;
  room.clues = [];
  room.votes = {};
  room.lastResult = null;
  return notice;
}

function removePlayer(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room) return null;
  socketToRoom.delete(socketId);

  const idx = room.players.findIndex((p) => p.id === socketId);
  if (idx === -1) return null;
  const wasHost = room.hostId === socketId;
  const wasImposter = socketId === room.imposterId;
  room.players.splice(idx, 1);

  if (room.players.length === 0) {
    rooms.delete(room.code);
    return null;
  }

  if (wasHost) {
    room.hostId = room.players[0].id;
  }

  let notice;

  if (room.phase !== 'LOBBY') {
    if (room.players.length < MIN_PLAYERS) {
      notice = resetToLobby(room, 'For få spillere tilbage — runden blev afsluttet.');
    } else if (wasImposter) {
      notice = resetToLobby(room, 'Imposteren forlod spillet — runden blev afsluttet.');
    } else {
      const turnIdx = room.turnOrder.indexOf(socketId);
      if (turnIdx !== -1) {
        room.turnOrder.splice(turnIdx, 1);
        if (room.currentTurnIndex > turnIdx) room.currentTurnIndex -= 1;
        if (room.phase === 'CLUES' && room.currentTurnIndex >= room.turnOrder.length) {
          room.phase = 'VOTING';
        }
      }
      delete room.votes[socketId];
      for (const [voter, voted] of Object.entries(room.votes)) {
        if (voted === socketId) delete room.votes[voter];
      }
      resolveVotesIfComplete(room);
    }
  }

  return { room, notice };
}

function buildPublicState(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    phase: room.phase,
    category: room.category,
    word: room.phase === 'RESULT' ? room.word : null,
    players: room.players.map((p) => ({ id: p.id, name: p.name })),
    turnOrder: room.turnOrder,
    currentTurnPlayerId: room.turnOrder[room.currentTurnIndex] || null,
    clues: room.clues,
    votedPlayerIds: Object.keys(room.votes),
    votes: room.phase === 'RESULT' ? room.votes : null,
    imposterId: room.phase === 'RESULT' || room.phase === 'IMPOSTER_GUESS' ? room.imposterId : null,
    lastResult: room.phase === 'RESULT' || room.phase === 'IMPOSTER_GUESS' ? room.lastResult : null,
    minPlayers: MIN_PLAYERS,
  };
}

module.exports = {
  MIN_PLAYERS,
  MAX_PLAYERS,
  createRoom,
  joinRoom,
  startGame,
  submitClue,
  submitVote,
  imposterGuess,
  playAgain,
  removePlayer,
  roomCodeFor,
  getRoomBySocket,
  buildPublicState,
};
