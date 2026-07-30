(function () {
  const socket = io();
  let myId = null;
  let state = null;
  let role = null;
  let toastTimer = null;

  const $ = (id) => document.getElementById(id);

  function showView(id) {
    document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
    $(id).classList.remove('hidden');
  }

  function showToast(message, isNotice) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.toggle('notice', !!isNotice);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
  }

  function playerName(id) {
    if (!state) return 'Ukendt';
    const p = state.players.find((pl) => pl.id === id);
    return p ? p.name : 'Ukendt';
  }

  function isHost() {
    return !!state && state.hostId === myId;
  }

  // --- Start view -----------------------------------------------------

  const params = new URLSearchParams(location.search);
  const prefillRoom = (params.get('room') || '').toUpperCase();
  if (prefillRoom) {
    $('code-input').value = prefillRoom;
  }

  $('btn-create').addEventListener('click', () => {
    const name = $('name-input').value.trim();
    if (!name) return showToast('Skriv dit navn først.');
    socket.emit('createRoom', { name });
  });

  $('btn-join').addEventListener('click', () => {
    const name = $('name-input').value.trim();
    const code = $('code-input').value.trim().toUpperCase();
    if (!name) return showToast('Skriv dit navn først.');
    if (!code) return showToast('Skriv en rumkode.');
    socket.emit('joinRoom', { name, code });
  });

  // --- Lobby view -------------------------------------------------------

  let selectedRounds = 1;
  document.querySelectorAll('.round-option').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.rounds) === selectedRounds);
    btn.addEventListener('click', () => {
      selectedRounds = Number(btn.dataset.rounds);
      document.querySelectorAll('.round-option').forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  $('btn-start').addEventListener('click', () => {
    socket.emit('startGame', { rounds: selectedRounds });
  });

  function renderLobby() {
    showView('view-lobby');
    $('lobby-code').textContent = state.code;

    const joinUrl = `${location.origin}/?room=${state.code}`;
    const qr = qrcode(0, 'M');
    qr.addData(joinUrl);
    qr.make();
    $('qr-container').innerHTML = qr.createImgTag(5, 4);

    $('player-list').innerHTML = state.players
      .map((p) => {
        const tags = [];
        if (p.id === state.hostId) tags.push('👑');
        if (p.id === myId) tags.push('(dig)');
        return `<li><span>${escapeHtml(p.name)}</span><span>${tags.join(' ')}</span></li>`;
      })
      .join('');

    const startBtn = $('btn-start');
    const hint = $('lobby-hint');
    $('rounds-select').classList.toggle('hidden', !isHost());
    if (isHost()) {
      startBtn.classList.remove('hidden');
      const enough = state.players.length >= state.minPlayers;
      startBtn.disabled = !enough;
      hint.textContent = enough
        ? ''
        : `Der skal mindst ${state.minPlayers} spillere (I er ${state.players.length}).`;
    } else {
      startBtn.classList.add('hidden');
      hint.textContent = 'Venter på at værten starter spillet...';
    }
  }

  // --- Clue view --------------------------------------------------------

  $('btn-submit-clue').addEventListener('click', submitClue);
  $('clue-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitClue();
  });

  function submitClue() {
    const clue = $('clue-input').value.trim();
    if (!clue) return showToast('Skriv et hint.');
    socket.emit('submitClue', { clue });
    $('clue-input').value = '';
  }

  function renderClueGroups(clues, showRoundHeaders) {
    if (!clues.length) return '<p class="hint">Ingen hints endnu</p>';
    const clueLine = (c) => `<li><span><strong>${escapeHtml(c.name)}:</strong> ${escapeHtml(c.clue)}</span></li>`;
    if (!showRoundHeaders) {
      return `<ul class="list">${clues.map(clueLine).join('')}</ul>`;
    }
    const byRound = {};
    clues.forEach((c) => {
      (byRound[c.round] = byRound[c.round] || []).push(c);
    });
    return Object.keys(byRound)
      .sort((a, b) => a - b)
      .map((round) => `<h4 class="round-heading">Runde ${round}</h4><ul class="list">${byRound[round].map(clueLine).join('')}</ul>`)
      .join('');
  }

  function renderClue() {
    showView('view-clue');
    $('clue-category').textContent = state.category || '';

    if (role && role.isImposter) {
      $('clue-role-label').textContent = 'Din rolle';
      $('clue-word').textContent = 'DU ER IMPOSTEREN 🕵️';
    } else if (role) {
      $('clue-role-label').textContent = 'Dit ord';
      $('clue-word').textContent = role.word || '';
    }

    $('clue-round-label').textContent = state.rounds > 1 ? `Runde ${state.currentRound} af ${state.rounds}` : '';

    const cluedIds = new Set(
      state.clues.filter((c) => c.round === state.currentRound).map((c) => c.playerId)
    );
    $('turn-order-list').innerHTML = state.turnOrder
      .map((id) => {
        const classes = [];
        if (id === state.currentTurnPlayerId) classes.push('active');
        if (cluedIds.has(id)) classes.push('done');
        const mark = cluedIds.has(id) ? '✔' : id === state.currentTurnPlayerId ? '…' : '';
        return `<li class="${classes.join(' ')}"><span>${escapeHtml(playerName(id))}${id === myId ? ' (dig)' : ''}</span><span>${mark}</span></li>`;
      })
      .join('');

    const myTurn = state.currentTurnPlayerId === myId;
    $('clue-input-area').classList.toggle('hidden', !myTurn);
    $('clue-wait-msg').textContent = myTurn ? '' : `Venter på ${playerName(state.currentTurnPlayerId)}...`;

    $('clue-list').innerHTML = renderClueGroups(state.clues, state.rounds > 1);
  }

  // --- Voting view --------------------------------------------------------

  function renderVoting() {
    showView('view-voting');
    $('voting-clue-list').innerHTML = renderClueGroups(state.clues, state.rounds > 1);
    const hasVoted = state.votedPlayerIds.includes(myId);
    $('vote-list').innerHTML = state.players
      .filter((p) => p.id !== myId)
      .map((p) => `<li><button data-id="${p.id}" ${hasVoted ? 'disabled' : ''}>${escapeHtml(p.name)}</button></li>`)
      .join('');

    if (!hasVoted) {
      $('vote-list').querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          socket.emit('submitVote', { votedId: btn.dataset.id });
        });
      });
    }

    $('vote-progress').textContent = `${state.votedPlayerIds.length} af ${state.players.length} har stemt`;
  }

  // --- Imposter guess view --------------------------------------------------------

  $('btn-submit-guess').addEventListener('click', submitGuess);
  $('guess-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitGuess();
  });

  function submitGuess() {
    const guess = $('guess-input').value.trim();
    if (!guess) return showToast('Skriv dit gæt.');
    socket.emit('imposterGuess', { guess });
  }

  function renderGuess() {
    showView('view-guess');
    const amImposter = state.imposterId === myId;
    $('guess-imposter-area').classList.toggle('hidden', !amImposter);
    $('guess-wait-area').classList.toggle('hidden', amImposter);
    if (!amImposter) {
      $('guess-wait-title').textContent = `${state.lastResult.accusedName} blev afsløret som imposteren!`;
    } else {
      $('guess-input').value = '';
    }
  }

  // --- Result view --------------------------------------------------------

  $('btn-play-again').addEventListener('click', () => {
    socket.emit('playAgain');
  });

  function renderResult() {
    showView('view-result');
    const r = state.lastResult;
    let title;
    let detail = '';

    if (r.wasImposter) {
      if (r.winner === 'imposter') {
        title = `${r.accusedName} var imposteren, men gættede ordet rigtigt! 🕵️`;
        detail = `Gættede: "${r.imposterGuess}" — Imposteren vinder!`;
      } else {
        title = `${r.accusedName} var imposteren! 🎉`;
        detail = `Gættede: "${r.imposterGuess}" — forkert. Spillerne vinder!`;
      }
    } else {
      title = `${r.accusedName} var ikke imposteren.`;
      detail = `${playerName(state.imposterId)} var imposteren og vinder! 🕵️`;
    }

    $('result-title').textContent = title;
    $('result-detail').textContent = detail;
    $('result-word').textContent = `Ordet var: ${state.word} (${state.category})`;

    $('btn-play-again').classList.toggle('hidden', !isHost());
    $('result-wait').classList.toggle('hidden', isHost());
  }

  // --- Dispatch --------------------------------------------------------

  function render() {
    if (!state) return;
    if (state.phase === 'LOBBY') renderLobby();
    else if (state.phase === 'CLUES') renderClue();
    else if (state.phase === 'VOTING') renderVoting();
    else if (state.phase === 'IMPOSTER_GUESS') renderGuess();
    else if (state.phase === 'RESULT') renderResult();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Socket events --------------------------------------------------------

  socket.on('connect', () => {
    myId = socket.id;
  });

  socket.on('roomUpdate', (payload) => {
    state = payload;
    render();
  });

  socket.on('roleAssigned', (payload) => {
    role = payload;
    render();
  });

  socket.on('notice', (message) => showToast(message, true));
  socket.on('errorMsg', (message) => showToast(message, false));
})();
