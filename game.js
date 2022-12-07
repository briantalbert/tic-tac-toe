const Player = (playerName, letter, type) => {
    let name = playerName
    return {name, letter, type}
}

const Game = (function() {
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

    const gameOver = () => {
        let board = GameBoard.getBoard()

        //check for horizontal wins
        for (let row = 0; row < 3; row++) {
            if (board[row][0] != '' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                return true
            }
        }

        //check for vertical wins
        for (let col = 0; col < 3; col++) {
            if (board[0][col] != '' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                return true
            }
        }

        // Check for wins on diagonal 1 (top-left to bottom-right)
        if (board[0][0] != '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return true
        }

        // Check for wins on diagonal 2 (top-right to bottom-left)
        if (board[0][2] != '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return true
        }

        return false
    }

    const isCat = () => {
        let blanks = GameBoard.getEmptySquares()
        if (blanks.length == 0) {
            return true
        } 
    }

    const getBestMove = (player) => {
        //looks at all empty squares to see if it is possible to
        //win or to block the other player from winning. if neither
        //of those is possible, selects random empty square. 
        
        let empties = GameBoard.getEmptySquares()
        const board = GameBoard.getBoard()
        var wins = []
        var blocks = []

        empties.forEach(square => {
            let row = parseInt(square.getAttribute('data-row'), 10)
            let col = parseInt(square.getAttribute('data-col'), 10)

            //look at corners, check diagonals
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

                if (board[0][2] == board[2][0] && board[0][2] != '') {
                    if (board[0][0] == player.letter) {
                        wins.push(square)
                    } else {
                        blocks.push(square)
                    }
                }
            }

            if (row == 0 && col == 0) {
                if (board[1][1] == board[2][2] && board[1][1] != '') {
                    if (board[1][1] == player.letter) {
                        wins.push(square)
                    } else {
                        blocks.push(square)
                    }
                }
            }

            //checking horizontal
            if (board[row][(col + 1) % 3] == board[row][(col + 2) % 3] && board[row][(col + 1) % 3] != '') {
                if (board[row][(col + 1) % 3] == player.letter) {
                    wins.push(square)
                } else {
                    blocks.push(square)
                }
            }
            
            //checking vertial
            if (board[(row + 1) % 3][col] == board[(row + 2) % 3][col] && board[(row + 1) % 3][col] != '') {
                if (board[(row + 1) % 3][col] == player.letter) {
                    wins.push(square)
                } else {
                    blocks.push(square)
                }
            }
        });

        if (wins.length > 0) {
            return wins[Math.floor(Math.random() * wins.length)]
        } else if (blocks.length > 0) {
            return blocks[Math.floor(Math.random() * blocks.length)]
        } else {
            return empties[Math.floor(Math.random() * empties.length)]
        }
    }

    const getCompChoice = (player) => {
        let empties = GameBoard.getEmptySquares()
        switch (document.querySelector('#diffSelect').value) {
            case 'easy':
                return empties[Math.floor(Math.random() * empties.length)]
                break;
            case 'hard':
                let choice = getBestMove(player)
                return choice
                break;
        }
    }

    const nextPlayer = (player) => {
        playerList = GameBoard.getPlayers()
        currentPlayerIdx = playerList.indexOf(player)
        next = playerList[(currentPlayerIdx + 1) % 2]
        if (next.type == 'comp') {
            const choice = getCompChoice(next)
            if(GameBoard.updateBoard(choice, next)) {
                return nextPlayer(next)
            }
        }
        return next
    }

    return {createPlayers, gameOver, isCat, nextPlayer}
})();

const GameBoard = (function() {
    let players = []
    var currentPlayer
    var board = [['','',''],
                 ['','',''],
                 ['','','']];

    const footerText = document.querySelector('.footer-text')
    
    const getBoard = () => {
        return board
    }

    const getPlayers = () => {
        return players
    }

    const getEmptySquares = () => {
        var empties = []
        squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            if (square.textContent == '') {
                empties.push(square)
            }
        })
        return empties
    }

    const createGameBoard = () => {
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
    }

    const disableSquares = () => {
        let squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            square.classList.remove('active')
        });
    }

    const enableSquares = () => {
        let squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            square.classList.add('active')
        });
    }

    const updateBoard = (gameSquare, player) => {
        //returns true if marker was able to be
        //placed and did not result in a win or
        //a cat game.

        if (gameSquare.textContent == '') {
            board[gameSquare.getAttribute('data-row')][gameSquare.getAttribute('data-col')] = player.letter;
            gameSquare.textContent = player.letter
            gameSquare.classList.remove('active')
        }
        if (Game.gameOver()) {
            footerText.textContent = `Game over! ${player.name} wins!`
            disableSquares()
            return false
        } else if (Game.isCat()) {
            footerText.textContent = `Game over! Cat game!`
            disableSquares()
            return false
        }

        return true
    }

    const addEventToSquare = (gameSquare) => {
        gameSquare.addEventListener('mousedown', () => {
            if (gameSquare.classList.contains('active')) {
                gameSquare.classList.add('clicked')
                if (updateBoard(gameSquare, currentPlayer)) {
                    currentPlayer = Game.nextPlayer(currentPlayer)
                }
            }
        })

        gameSquare.addEventListener('mouseup', () => {
            gameSquare.classList.remove('clicked')
        })
    }

    const initialize = (function() {
        createGameBoard()
        startButton = document.querySelector('#begin')
        startButton.addEventListener('click', (e) => {
            e.preventDefault()
            players = Game.createPlayers()
            currentPlayer = players[0]
            enableSquares()
        })
    })();

    return {getBoard, getEmptySquares, getPlayers, updateBoard}
})();

