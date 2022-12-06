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
    const gameOver = () => {
        let board = GameBoard.getBoard()
        if (board[0][0] != '' && board[0][0] == board[1][0] && board[1][0] == board[2][0] ||
            board[0][1] != '' && board[0][1] == board[1][1] && board[1][1] == board[2][1] ||
            board[0][2] != '' && board[0][2] == board[1][2] && board[1][2] == board[2][2]) {
                //vertical column 3 in a row
                GameBoard.disableSquares()
                return true
        } else if (board[0][0] != '' && board[0][0] == board[0][1] && board[0][1] == board[0][2] ||
        board[1][0] != '' && board[1][0] == board[1][1] && board[1][1] == board[1][2] ||
        board[2][0] != '' && board[2][0] == board[2][1] && board[2][1] == board[2][2]) {
            //horizontal row 3 in a row
            GameBoard.disableSquares()
            return true
        } else if (board[0][0] != '' && board[0][0] == board[1][1] && board[1][1] == board[2][2] ||
        board[0][2] != '' && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            //diagonal 3 in a row
            GameBoard.disableSquares()
            return true
        } else if(isCat()) {

            return true
        } else {
            return false
        }
      
    }

    const isCat = () => {
        var empties = []
        squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            if (square.textContent == '') {
                empties.push(square)
            }
        })
        if (empties.length == 0) {
            GameBoard.disableSquares()
            return true
        }
        return false
    }

    const getBlockable = (empties, player) => {
        const board = GameBoard.getBoard()
        var wins = []
        var blocks = []
        empties.forEach(square => {
            let row = parseInt(square.getAttribute('data-row'), 10)
            let col = parseInt(square.getAttribute('data-col'), 10)

            //checking diagonals
            if (row == 0 && col == 2) {
                if (board[1][1] == board[2][0] && board[1][1] != '') {
                    if (board[1][1] == player.letter) {
                        wins.push(square)
                    } else {
                        blocks.push(square)
                    }
                }
            }

            if (row == 2 && col == 0) {
                if (board[1][1] == board[0][2] && board[1][1] != '') {
                    if (board[1][1] == player.letter) {
                        wins.push(square)
                    } else {
                        blocks.push(square)
                    }
                }
            }

            if (row ==1 && col == 1) {
                if (board[0][0] == board[2][2] && board[0][0] != '') {
                    if (board[0][0] == player.letter) {
                        wins.push(square)
                    } else {
                        blocks.push(square)
                    }
                }
            }

            if ((row == 0 && col == 0) || row == 1 && col == 1 || row == 2 && col == 2) {
                if (board[(row + 1) % 3][(col + 1) % 3] == board[(row + 2) % 3][(col + 2) % 3] && board[(row + 1) % 3][(col + 1) % 3] != '') {
                    if (board[(row + 1) % 3][(col + 1) % 3] == player.letter) {
                        wins.push(square)
                    } else {
                        blocks.push(square)
                    }
                }
            }

            //checking horizontal & vertical
            if (board[row][(col + 1) % 3] == board[row][(col + 2) % 3] && board[row][(col + 1) % 3] != '') {
                if (board[row][(col + 1) % 3] == player.letter) {
                    wins.push(square)
                } else {
                    blocks.push(square)
                }
            }else if (board[(row + 1) % 3][col] == board[(row + 2) % 3][col] && board[(row + 1) % 3][col] != '') {
                if (board[(row + 1) % 3][col] == player.letter) {
                    wins.push(square)
                } else {
                    blocks.push(square)
                }
            }
    
        });

        if (wins.length > 0) {
            return wins
        } else if (blocks.length > 0) {
            return blocks
        } else {
            return empties
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

        let diff = document.querySelector("#diffSelect").value
        if (diff == 'easy') {
            if (empties.length > 0) {
                let chosenSquare = empties[Math.floor(Math.random() * empties.length)]
                GameBoard.updateBoard(chosenSquare, compPlayer.letter)
            } else {
                GameBoard.footerText.textContent = 'Game over! Cat game!'
                GameBoard.disableSquares()
            }
        } else if (diff == 'hard') {
            let options = getBlockable(empties, compPlayer)
            if (options.length > 0) {
                let chosenSquare = options[Math.floor(Math.random() * options.length)]
                GameBoard.updateBoard(chosenSquare, compPlayer.letter)
            } else {
                GameBoard.footerText.textContent = 'Game over! Cat game!'
                GameBoard.disableSquares()
            }
        }
    };
    

    const nextPlayer = (players) => {
        playerIdx = (playerIdx + 1) % 2
        next = players[playerIdx]
        if (next.type == 'comp') {
            compTurn(next)
            if (!(gameOver())) {
                nextPlayer(players)
            } else if(isCat()) {
                GameBoard.footerText.textContent = "Game over! Cat game!"
            } else {
                GameBoard.footerText.textContent = "Game over! " + next.name + " wins!"
                GameBoard.disableSquares()
                return
            }
        }
        return next
    }

    return {gameOver, createPlayers, nextPlayer, isCat}
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
            if (gameSquare.classList.contains('active')) {
                if (!(gameStarted)) {
                    players = Game.createPlayers()
                    currentPlayer = players[0]
                    gameStarted = true
                }
                gameSquare.classList.add('clicked')
                footerText.textContent = ''
                if (gameSquare.textContent == '') {
                    updateBoard(gameSquare, currentPlayer.letter)
                    currentPlayer = Game.nextPlayer(players)
                    if (!(Game.gameOver(board))) {
                        footerText.textContent = currentPlayer.name + "'s turn!"
                    } else if (Game.isCat()){
                        footerText.textContent = "Game over! Cat game!"
                        disableSquares()
                    } else {
                        footerText.textContent = "Game over! " + currentPlayer.name + " wins!"
                    }
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
                gameSquare.classList.add('active')

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

    const disableSquares = () => {
        let squares = document.querySelectorAll('.square')
        squares.forEach(box => {
            box.classList.remove('active')
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

    

    return {updateBoard, getBoard, disableSquares, players, footerText}
    
})();