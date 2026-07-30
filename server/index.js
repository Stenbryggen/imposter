const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const rooms = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..', 'public')));

io.on('connection', (socket) => {
  const emitError = (err) => {
    socket.emit('errorMsg', err.message || 'Der skete en fejl.');
  };

  const broadcast = (room) => {
    io.to(room.code).emit('roomUpdate', rooms.buildPublicState(room));
  };

  const sendRoles = (room) => {
    for (const player of room.players) {
      const isImposter = player.id === room.imposterId;
      io.to(player.id).emit('roleAssigned', {
        isImposter,
        category: room.category,
        word: isImposter ? null : room.word,
      });
    }
  };

  socket.on('createRoom', ({ name } = {}) => {
    try {
      const room = rooms.createRoom(socket.id, name);
      socket.join(room.code);
      broadcast(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('joinRoom', ({ code, name } = {}) => {
    try {
      const room = rooms.joinRoom(code, socket.id, name);
      socket.join(room.code);
      broadcast(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('startGame', ({ rounds } = {}) => {
    try {
      const code = rooms.roomCodeFor(socket.id);
      const room = rooms.startGame(code, socket.id, rounds);
      broadcast(room);
      sendRoles(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('submitClue', ({ clue } = {}) => {
    try {
      const code = rooms.roomCodeFor(socket.id);
      const room = rooms.submitClue(code, socket.id, clue);
      broadcast(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('submitVote', ({ votedId } = {}) => {
    try {
      const code = rooms.roomCodeFor(socket.id);
      const room = rooms.submitVote(code, socket.id, votedId);
      broadcast(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('imposterGuess', ({ guess } = {}) => {
    try {
      const code = rooms.roomCodeFor(socket.id);
      const room = rooms.imposterGuess(code, socket.id, guess);
      broadcast(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('playAgain', () => {
    try {
      const code = rooms.roomCodeFor(socket.id);
      const room = rooms.playAgain(code, socket.id);
      broadcast(room);
    } catch (err) {
      emitError(err);
    }
  });

  socket.on('disconnect', () => {
    const result = rooms.removePlayer(socket.id);
    if (result && result.room) {
      broadcast(result.room);
      if (result.notice) {
        io.to(result.room.code).emit('notice', result.notice);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Imposter-spillet kører på port ${PORT}`);
});
