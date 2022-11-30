const Player = (playerName, letter) => {
    let name = playerName
    
    return {name, letter}
}

const Game = (function() {
    const gameOver = (board) => {
        //check verticals
        if (board[0][0] == board[1][0] == board[2][0] ||
            board[0][1] == board[1][1] == board[2][1] ||
            board[0][2] == board[1][2] == board[2][2]) {
                return true
            }
    }
})();

const GameBoard = (function() {
    var board = [['','',''],
                 ['','',''],
                 ['','','']]
    
    const updateBoard = (row, col, letter) => {

        board[row][col] = letter;
    }

    const showBoardConsole = () => {
        board.forEach(row => {
            console.log(row[0] + '|' + row[1] + '|' + row[2])
        });
    }

    const getBoard = () => {
        return board;
    }

    return {showBoardConsole, updateBoard, getBoard}
    
})();


boardDiv = document.querySelector('.board')
for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const gameSquare = document.createElement('div')
        gameSquare.setAttribute('row', i)     
        gameSquare.setAttribute('col', j)
        gameSquare.classList.add('square')

        gameSquare.addEventListener('mousedown', () => {
            gameSquare.classList.add('clicked')
            if (gameSquare.textContent == '') {
                GameBoard.updateBoard(gameSquare.getAttribute('row'), gameSquare.getAttribute('col'), currentPlayer.letter)
                gameSquare.textContent = currentPlayer.letter
                currentPlayerIdx = (currentPlayerIdx + 1) % 2
                currentPlayer = players[currentPlayerIdx]
            }
        })

        gameSquare.addEventListener('mouseup', () => {
            gameSquare.classList.remove('clicked')
        })
        boardDiv.appendChild(gameSquare)
    }
}

const player1 = Player('Brian', 'X')
const player2 = Player('Laura', 'O')
const players = [player1, player2]
let currentPlayerIdx = 0
let currentPlayer = players[currentPlayerIdx]


