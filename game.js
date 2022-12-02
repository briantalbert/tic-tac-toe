const Player = (playerName, letter) => {
    let name = playerName
    return {name, letter}
}

const Game = (function() {
    //create players
    const player1 = Player(document.getElementById('player1').value ? document.getElementById('player1').value : 'Player One', 'X')
    const player2 = Player(document.getElementById('player2').value ? document.getElementById('player2').value : 'Player Two', 'O')
    const players = [player1, player2]
    var playerIdx = 1

    //check for win condition
    const gameOver = (board) => {
        if (board[0][0] != '' && board[0][0] == board[1][0] && board[1][0] == board[2][0] ||
            board[0][1] != '' && board[0][1] == board[1][1] && board[1][1] == board[2][1] ||
            board[0][2] != '' && board[0][2] == board[1][2] && board[1][2] == board[2][2]) {
                //vertical column 3 in a row
                return true
        } else if (board[0][0] != '' && board[0][0] == board[0][1] && board[0][1] == board[0][2] ||
        board[1][0] != '' && board[1][0] == board[1][1] && board[1][1] == board[1][2] ||
        board[2][0] != '' && board[2][0] == board[2][1] && board[2][1] == board[2][2]) {
            //horizontal row 3 in a row
            return true
        } else if (board[0][0] != '' && board[0][0] == board[1][1] && board[1][1] == board[2][2] ||
        board[0][2] != '' && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            //diagonal 3 in a row
            return true
        } else {
            return false
        }
      
    }

    const nextPlayer = () => {
        playerIdx = (playerIdx + 1) % 2
        return players[playerIdx]
    }

    return {gameOver, players, nextPlayer}
})();

const GameBoard = (function() {
    const players = Game.players
    var currentPlayer = Game.nextPlayer()
    const footerText = document.querySelector('.footer-text')

    var board = [['','',''],
                 ['','',''],
                 ['','','']];
    
    const addEventToSquare = (gameSquare) => {
        gameSquare.addEventListener('mousedown', () => {
            gameSquare.classList.add('clicked')
            footerText.textContent = ''
            if (gameSquare.textContent == '') {
                updateBoard(gameSquare, currentPlayer.letter)
                if (!(Game.gameOver(board))) {
                    currentPlayer = Game.nextPlayer()
                    footerText.textContent = currentPlayer.name + "'s turn!"
                } else {
                    footerText.textContent = "Game over! " + currentPlayer.name + " wins!"
                }
            }
        })

        gameSquare.addEventListener('mouseup', () => {
            gameSquare.classList.remove('clicked')
        })
    }

    const makeBoard = (function() {
        boardDiv = document.querySelector('.board')
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const gameSquare = document.createElement('div')
                gameSquare.setAttribute('data-row', i)     
                gameSquare.setAttribute('data-col', j)
                gameSquare.classList.add('square')

                addEventToSquare(gameSquare)
                
                boardDiv.appendChild(gameSquare)
            }
        }
    })();
    
    const updateBoard = (gameSquare, letter) => {
        board[gameSquare.getAttribute('data-row')][gameSquare.getAttribute('data-col')] = letter;
        gameSquare.textContent = currentPlayer.letter
    }

    const getBoard = () => {
        return board;
    }

    const resetBoard = () => {
        let squares = document.querySelectorAll('.square')
        squares.forEach(box => {
            console.log(box)
            box.textContent = ''
            GameBoard.updateBoard(box, '')
        });
    }

    return {updateBoard, getBoard, resetBoard}
    
})();