document.addEventListener("DOMContentLoaded", () => {

    const DisplayController = (() => {
        const boardContainer = document.getElementById("board");
        const cells = boardContainer.querySelectorAll(".cell");
        const startBtn = document.getElementById("playBtn");
        const resetBtn = document.getElementById("restartBtn");
        const player1Input = document.getElementById("player1Name");
        const player2Input = document.getElementById("player2Name");
        const messageEl = document.getElementById("message");
        const turnEl = document.getElementById("turnIndicator");

        const renderCell = (index, value) => {
            cells[index].textContent = value;
            cells[index].classList.remove("X", "O");
            cells[index].classList.add(value);
        };

        const resetBoard = () => {
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove("X", "O", "win");
            });
            messageEl.textContent = '';
            turnEl.textContent = 'Enter names and click Play';
        };

        const highlightWinningCells = (line) => {
            line.forEach(i => cells[i].classList.add("win"));
        };

        const setMessage = (text) => messageEl.textContent = text;
        const setTurn = (text) => turnEl.textContent = text;

        const initCellListener = (handleCellClick) => {
            boardContainer.addEventListener("click", (e) => {
                if (!e.target.classList.contains("cell")) return;
                const index = Array.from(cells).indexOf(e.target);
                handleCellClick(index);
            });
        };

        const initButtons = (handleStart, handleReset) => {
            startBtn.addEventListener("click", handleStart);
            resetBtn.addEventListener("click", handleReset);
        };

        return {
            renderCell, resetBoard, highlightWinningCells,
            setMessage, setTurn,
            player1Input, player2Input,
            initCellListener, initButtons
        };
    })();

    const Gameboard = (() => {
        let board = Array(9).fill(null);

        const updateCell = (index, mark) => {
            if (board[index] !== null) return false;
            board[index] = mark;
            return true;
        };

        const getWinner = () => {
            const lines = [
                [0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]
            ];
            for (const line of lines) {
                const [a,b,c] = line;
                if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                    return { mark: board[a], line };
                }
            }
            if (board.every(cell => cell !== null)) return { mark: 'tie' };
            return null;
        };

        const reset = () => board = Array(9).fill(null);

        return { updateCell, getWinner, reset };
    })();

    const Player = (name, mark) => ({ name, mark });

    const Game = (() => {
        let player1, player2, currentPlayer;
        let gameOver = false;

        let renderCallback = () => {};
        let highlightCallback = () => {};
        let messageCallback = () => {};
        let turnCallback = () => {};

        const setCallbacks = ({ render, highlight, message, turn }) => {
            renderCallback = render;
            highlightCallback = highlight;
            messageCallback = message;
            turnCallback = turn;
        };

        const switchTurn = () => {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            turnCallback(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
        };

        const handleCellClick = (index) => {
            if (gameOver) return;

            const placed = Gameboard.updateCell(index, currentPlayer.mark);
            if (!placed) return;

            renderCallback(index, currentPlayer.mark);

            const winnerData = Gameboard.getWinner();
            if (winnerData) {
                gameOver = true;
                if (winnerData.mark === 'tie') {
                    messageCallback("It's a tie!");
                    turnCallback("Game over");
                } else {
                    highlightCallback(winnerData.line);
                    messageCallback(`${currentPlayer.name} wins!`);
                    turnCallback("Game over");
                }
            } else {
                switchTurn();
            }
        };

        const start = (name1, name2) => {
            Gameboard.reset();
            DisplayController.resetBoard();
            player1 = Player(name1 || "Player 1", "X");
            player2 = Player(name2 || "Player 2", "O");
            currentPlayer = player1;
            gameOver = false;
            turnCallback(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
        };

        return { start, handleCellClick, setCallbacks };
    })();

    Game.setCallbacks({
        render: DisplayController.renderCell,
        highlight: DisplayController.highlightWinningCells,
        message: DisplayController.setMessage,
        turn: DisplayController.setTurn
    });

    DisplayController.initCellListener(Game.handleCellClick);

    const handleStart = () => {
        const name1 = DisplayController.player1Input.value.trim();
        const name2 = DisplayController.player2Input.value.trim();
        Game.start(name1, name2);
    };

    const handleReset = () => {
        const name1 = DisplayController.player1Input.value.trim();
        const name2 = DisplayController.player2Input.value.trim();
        Game.start(name1, name2);
    };

    DisplayController.initButtons(handleStart, handleReset);
});