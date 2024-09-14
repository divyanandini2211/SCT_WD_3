const board = document.getElementById('gameBoard');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const playerVsPlayerBtn = document.getElementById('playerVsPlayerBtn');
const playerVsComputerBtn = document.getElementById('playerVsComputerBtn');
const popup = document.createElement('div');
popup.classList.add('popup');
document.body.appendChild(popup);

const popupContent = document.createElement('div');
popupContent.classList.add('popup-content');
popup.appendChild(popupContent);

let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
let mode = 'player';

const initializeBoard = () => {
    board.innerHTML = '';
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
};

const handleClick = (e) => {
    const index = e.target.dataset.index;
    if (boardState[index] || !gameActive) return;

    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin()) {
        showPopup(`👑 Player ${currentPlayer} Wins!`);
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell)) {
        showPopup('It\'s a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;

    if (currentPlayer === 'O' && gameActive && mode === 'computer') {
        setTimeout(computerMove, 500);
    }
};

const computerMove = () => {
    const availableCells = boardState.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
    if (availableCells.length === 0) return;

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    boardState[randomIndex] = 'O';
    document.querySelector(`.cell[data-index='${randomIndex}']`).textContent = 'O';

    if (checkWin()) {
        showPopup(`👑 Player O Wins!`);
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell)) {
        showPopup('It\'s a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
};

const checkWin = () => {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
};

const showPopup = (message) => {
    popupContent.innerHTML = `
        <h2>${message}</h2>
        <button onclick="closePopup()">OK</button>
    `;
    popup.style.display = 'flex';
};

const closePopup = () => {
    popup.style.display = 'none';
};

const handleModeChange = (newMode) => {
    mode = newMode;
    initializeBoard();
    // Remove active class from both buttons
    playerVsPlayerBtn.classList.remove('active');
    playerVsComputerBtn.classList.remove('active');
    // Add active class to the clicked button
    if (newMode === 'player') {
        playerVsPlayerBtn.classList.add('active');
    } else if (newMode === 'computer') {
        playerVsComputerBtn.classList.add('active');
    }
};

playerVsPlayerBtn.addEventListener('click', () => handleModeChange('player'));
playerVsComputerBtn.addEventListener('click', () => handleModeChange('computer'));
resetBtn.addEventListener('click', initializeBoard);

initializeBoard();




