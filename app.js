 const Gameboard = (() => {
    let gameboard = Array(9).fill(null); 
    
    const reset = () => {gameboard = Array(9).fill(null)};
    const getGameboard = () => [...gameboard];
    const updateGameboard = (index, mark) => {
        if (!Number.isInteger(index) || index < 0 || index > 8) {
            console.log("Invalid index. Use 0-8"); 
            return false
        }; 
        if (gameboard[index] !== null) {
            console.log("Cell occupied. Choose another."); 
            return false
        }
        gameboard[index] = mark;
        console.log(gameboard);
        return true;
    }

    const isFull = () => gameboard.every(v => v !== null); 

    const getWinner = () => {
        const lines = [
            [0,1,2],[3,4,5],[6,7,8], // rows 
            [0,3,6],[1,4,7],[2,5,8], // columns
            [0,4,8],[2,4,6]          // diagonals 
        ]
        
        // Check wins 
        for (const [a,b,c] of lines) {
            if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[b] === gameboard[c]) {
                return gameboard[a];
            }
        }

        // check tie 
        if (isFull()) return 'tie';
        return null;

    }
    
    return {
        updateGameboard,
        getGameboard, 
        reset, 
        getWinner, 
    }
})();

const Player = (name, mark) => {
    const getName = () => name; 
    const getMark = () => mark;
    return {
        getName, 
        getMark,
    }
}; 

const Game = (() => {
    const player1 = Player("Krystina", "X"); 
    const player2 = Player("Dilly", "O");     
    let current = player1; 
    let winner = null; // player object or "tie" or null 
    let gameOver = false;

    const getPlayer1 = () => player1; 
    const getPlayer2 = () => player2; 
    const getCurrentPlayer = () => current;

    const switchTurn = () => { current = current === player1 ? player2 : player1 ;};

    const playTurn = () => {
        if (gameOver) return winner; 
        const input = prompt(`It is ${current.getName()}'s turn. Choose your location 0-8`);
        if (input === null) {
            console.log("Game cancelled"); 
            gameOver = true; 
            return winner; 
        }
        const index = parseInt(input, 10);
        const placed = Gameboard.updateGameboard(index, current.getMark());
        if (!placed) return null; // invalid/occupied do not switch turns 

        let w = Gameboard.getWinner(); // check if there is a winner
        if (w) {
            gameOver = true; 
            winner = w === player1.getMark() ? player1 
                    : w === player2.getMark() ? player2
                    : "tie"; 
            console.log(winner === "tie" ? "Tie game!" : `Winner: ${winner.getName()} (${w})`);
            return winner; 
        } 
        switchTurn(); // if no winner then switch turns
        return null; 
    };

    const start = () => {
        Gameboard.reset();
        current = player1; 
        winner = null; 
        while (!gameOver) {
            const result = playTurn();    
        }
        return winner;
    }; 

    return { getPlayer1, getPlayer2, start }; 
})();

Game.start();