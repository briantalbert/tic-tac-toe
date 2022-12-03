const Player = (playerName, letter, type) => {
    let name = playerName
    return {name, letter, type}
}

const Game = (function() {
    //create players
    const createPlayers = () => {
        var player2
        const player1 = Player(document.getElementById('player1').value ? document.getElementById('player1').value : 'Player One', 'X', 'human')
        if (document.querySelector('#numPlayers').checked) {
            player2 = Player(document.getElementById('player2').value ? document.getElementById('player2').value : 'Player Two', 'O', 'comp')
        } else {
            player2 = Player(document.getElementById('player2').value ? document.getElementById('player2').value : 'Player Two', 'O', 'human')
        }
        const players = [player1, player2]

        return players
    }
    var playerIdx = 0

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

    const compTurn = (compPlayer) => {
        var empties = []
        squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            if (square.textContent == '') {
                empties.push(square)
            }
        })

        if (empties.length > 0) {
            chosenSquare = empties[Math.floor(Math.random() * empties.length)]
            GameBoard.updateBoard(chosenSquare, compPlayer.letter)
        } else {
            GameBoard.footerText.textContent = 'Game over! Cat game!'
        }
    };
    

    const nextPlayer = (players) => {
        playerIdx = (playerIdx + 1) % 2
        next = players[playerIdx]
        if (next.type == 'comp') {
            compTurn(next)
            nextPlayer(players)
        }
        return next
    }

    return {gameOver, createPlayers, nextPlayer}
})();

const GameBoard = (function() {
    let players = []
    var currentPlayer
    let gameStarted = false
    const footerText = document.querySelector('.footer-text')

    var board = [['','',''],
                 ['','',''],
                 ['','','']];
    
    const addEventToSquare = (gameSquare) => {
        gameSquare.addEventListener('mousedown', () => {
            if (!(gameStarted)) {
                players = Game.createPlayers()
                currentPlayer = players[0]
                gameStarted = true
            }
            gameSquare.classList.add('clicked')
            footerText.textContent = ''
            if (gameSquare.textContent == '') {
                updateBoard(gameSquare, currentPlayer.letter)
                if (!(Game.gameOver(board))) {
                    currentPlayer = Game.nextPlayer(players)
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
                //create square div elements
                const gameSquare = document.createElement('div')
                gameSquare.setAttribute('data-row', i)     
                gameSquare.setAttribute('data-col', j)
                gameSquare.classList.add('square')

                //add click events to squares
                addEventToSquare(gameSquare)
                
                //add squares to DOM
                boardDiv.appendChild(gameSquare)
            }
        }
    })
    
    const updateBoard = (gameSquare, letter) => {
        board[gameSquare.getAttribute('data-row')][gameSquare.getAttribute('data-col')] = letter;
        gameSquare.textContent = letter
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

    const initialize = (function() {
        startButton = document.querySelector('#begin')
        startButton.addEventListener('click', (e) => {
            e.preventDefault()
            players = Game.createPlayers()
            currentPlayer = players[0]
            footerText.textContent = currentPlayer.name + "'s turn!"
            gameStarted = true
        })
        makeBoard()
        
    })();

    

    return {updateBoard, getBoard, resetBoard, players}
    
})();