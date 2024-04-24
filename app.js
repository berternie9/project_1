// document.addEventListener("DOMContentLoaded", function () {
    // States 
    let twoPlayer = 0;
    let botSmart = 1;
    let botSimple = 2;
    let mode = twoPlayer;

    let userTurn = 3;
    let opponentTurn = 4;
    let whoseTurn = userTurn;

    let by3 = 4;
    let by4 = 5;
    let gameSize = by3;

    // Globals
    let playerAscore = 0;
    let playerBscore = 0;
    let winner;

    let winningCombosby3 = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    let winningCombosby4 = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[1,5,9,13],[2,6,10,14],[3,7,11,15],[4,8,12,16], [1,6,11,16], [4,7,10,13]];


    // Cache DOM element references
    const gameModeMsg = document.querySelector('.game-mode');
    const whoseTurnMsg = document.querySelector('.whose-turn');
    const playerAMsg = document.querySelector('.playerA');
    const playerBMsg = document.querySelector('.playerB');
    const playerAscoreMsg = document.querySelector('.playerAscore');
    const playerBscoreMsg = document.querySelector('.playerBscore');
    const winnerMsg = document.querySelector('.winner');

    const mainGameEle = document.querySelector('.main-game');
    const muteBtn = document.querySelector('.mute-btn');
    const by3Btn = document.querySelector('.by3-btn');
    const by4Btn = document.querySelector('.by4-btn');
    const resetGameBtn = document.querySelector('.reset-game-btn');
    const twoPlayerBtn = document.querySelector('.two-player-btn');
    const botSmartBtn = document.querySelector('.bot-smart-btn');
    const botSimpleBtn = document.querySelector('.bot-simple-btn');

    const squaresBy3 = document.querySelectorAll('.square-by3');
    const squaresBy4 = document.querySelectorAll('.square-by4');
    const squaresWrapperBy3 = document.querySelector('.squares-wrapper-by3');
    const squaresWrapperBy4 = document.querySelector('.squares-wrapper-by4');

    // Setup event listeners
    squaresBy3.forEach((square) => square.addEventListener('click', handleSquareClick));
    squaresBy4.forEach((square) => square.addEventListener('click', handleSquareClick));
    by3Btn.addEventListener('click', handleBy3Btn);
    by4Btn.addEventListener('click', handleBy4Btn);

    resetGameBtn.addEventListener('click', handleResetBtn);

    twoPlayerBtn.addEventListener('click', handleTwoPlayerBtn);
    botSmartBtn.addEventListener('click', handleBotSmartBtn);
    botSimpleBtn.addEventListener('click', handleBotSimpleBtn);

    // Event handlers
    function handleSquareClick (event) {
        if (mode === twoPlayer) {
            if (!event.target.classList.contains('checked')) {
                event.target.classList.add('checked');
                if (whoseTurn === userTurn) {
                    event.target.textContent = 'X';
                    event.target.classList.add('X');           
                } else if (whoseTurn === opponentTurn) {
                    event.target.classList.add('O');
                    event.target.textContent = 'O';
                }
                afterChecked();
            }
        } else if (mode === botSimple) {
            if (whoseTurn === userTurn) {
                if (!event.target.classList.contains('checked')) {
                    event.target.classList.add('checked');
                    event.target.textContent = 'X';
                    event.target.classList.add('X');
                    mainGameEle.classList.add('disabled');
                    afterChecked();
                    if (!(isThereAWinner()) && !(allSquaresFilled())) {
                        handleSquareClick();
                    }
                }           
            } else if (whoseTurn === opponentTurn) {     
                setTimeout(function () {
                    let target = chooseTargetSimple();
                    target.classList.add('checked');
                    target.classList.add('O');
                    target.textContent = 'O';
                    afterChecked();
                    if (!(isThereAWinner()) && !(allSquaresFilled())) {
                        mainGameEle.classList.remove('disabled');
                    }
                }, 800);
            }
            
        } else if (mode === botSmart) {
            if (!event.target.classList.contains('checked')) {
                event.target.classList.add('checked');
                if (whoseTurn === userTurn) {
                    event.target.textContent = 'X';
                    event.target.classList.add('X');           
                } else if (whoseTurn === opponentTurn) {
                    let target = chooseTargetSmart();
                    target.classList.add('O');
                    target.textContent = 'O';
                }
        
                afterChecked();
            }
        }
    }

    function handleResetBtn () {
        mainGameEle.className = 'main-game';
        if (gameSize === by3) {
            squaresBy3.forEach((square) => {
                square.className = 'square-by3';
                square.textContent = '';
            })
        } else if (gameSize === by4) {
            squaresBy4.forEach((square) => {
                square.className = 'square-by4';
                square.textContent = '';
            })
        }

        if ((mode === botSimple) || (mode === botSmart)) {
            whoseTurn = userTurn;
            updateWhoseTurnMsg();
        }
    }

    function handleTwoPlayerBtn () {
        mode = twoPlayer;
        whoseTurn = userTurn;
        playerAscore = 0;
        playerBscore = 0;
        winner = "";
        gameModeMsg.textContent = "2 player";
        updateWhoseTurnMsg();
        playerAMsg.textContent = "Player 1";
        playerBMsg.textContent = "Player 2";
        playerAscoreMsg.textContent = '0';
        playerBscoreMsg.textContent = '0';
        winnerMsg.textContent = "";
        handleResetBtn();
    }

    function handleBotSimpleBtn () {
        mode = botSimple;
        whoseTurn = userTurn;
        playerAscore = 0;
        playerBscore = 0;
        winner = "";
        gameModeMsg.textContent = "Bot (simple)";
        updateWhoseTurnMsg();
        playerAMsg.textContent = "Player";
        playerBMsg.textContent = "Bot (simple)";
        playerAscoreMsg.textContent = '0';
        playerBscoreMsg.textContent = '0';
        winnerMsg.textContent = "";
        handleResetBtn();
    }

    function handleBotSmartBtn () {
        mode = botSmart;
        whoseTurn = userTurn;
        playerAscore = 0;
        playerBscore = 0;
        winner = "";
        gameModeMsg.textContent = "Bot (smart)";
        updateWhoseTurnMsg();
        playerAMsg.textContent = "Player";
        playerBMsg.textContent = "Bot (smart)";
        playerAscoreMsg.textContent = '0';
        playerBscoreMsg.textContent = '0';
        winnerMsg.textContent = "";
        handleResetBtn();
    }


    function handleBy3Btn (event) {
        squaresWrapperBy3.style.display = 'grid';
        squaresWrapperBy4.style.display = 'none';
        gameSize = by3;
        if (mode === twoPlayer) {
            handleTwoPlayerBtn();
        } else if (mode === botSimple) {
            handleBotSimpleBtn();
        } else if (mode === botSmart) {
            handleBotSmartBtn();
        }
    }

    function handleBy4Btn (event) {
        squaresWrapperBy3.style.display = 'none';
        squaresWrapperBy4.style.display = 'grid';
        gameSize = by4;
        if (mode === twoPlayer) {
            handleTwoPlayerBtn();
        } else if (mode === botSimple) {
            handleBotSimpleBtn();
        } else if (mode === botSmart) {
            handleBotSmartBtn();
        }
    }

    // Other functions 
    function isThereAWinner () {
        if (gameSize === by3) {
            let squaresCheckedX = [];
            let squaresCheckedO = [];
            for (let squareBy3 of squaresBy3) {
                if ((squareBy3.classList.contains('checked')) && (squareBy3.classList.contains('X'))) {
                    squaresCheckedX.push(Number(squareBy3.dataset.tag));
                } else if ((squareBy3.classList.contains('checked')) && (squareBy3.classList.contains('O'))) {
                    squaresCheckedO.push(Number(squareBy3.dataset.tag));
                }
            }
            for (let combo of winningCombosby3) {
                if ((winningComboPresent(squaresCheckedX, combo)) || (winningComboPresent(squaresCheckedO, combo))) {
                    return true;
                }
            }
        } else if (gameSize === by4) {
            let squaresCheckedX = [];
            let squaresCheckedO = [];
            
            for (let squareBy4 of squaresBy4) {
                if ((squareBy4.classList.contains('checked')) && (squareBy4.classList.contains('X'))) {
                    squaresCheckedX.push(Number(squareBy4.dataset.tag));
                } else if ((squareBy4.classList.contains('checked')) && (squareBy4.classList.contains('O'))) {
                    squaresCheckedO.push(Number(squareBy4.dataset.tag));
                }
            }
            
            for (let combo of winningCombosby4) {
                if ((winningComboPresent(squaresCheckedX, combo)) || (winningComboPresent(squaresCheckedO, combo))) {
                    return true;
                }
            }
        }
        return false;
    }

    function winningComboPresent (largeArray, smallArray) {
        return smallArray.every((el) => {
            return largeArray.includes(el);
        })
    }

    function incrementScore () {
        if (whoseTurn === userTurn) {
            playerAscore++;
            playerAscoreMsg.textContent = playerAscore;
        } else {
            playerBscore++;
            playerBscoreMsg.textContent = playerBscore;
        }
    }   

    function currentTurnStr () {
        if (mode === twoPlayer) {
            if (whoseTurn === userTurn) {
                return 'Player 1';
            } else {
                return 'Player 2';
            }
        } else if ((mode === botSimple) || mode === botSmart) {
            if (whoseTurn === userTurn) {
                return 'Player';
            } else {
                return 'Bot';
            }
        }
    }

    function updateWhoseTurnMsg () {
        setTimeout(function () {
            whoseTurnMsg.textContent = currentTurnStr();
        }, 500);
    }

    function allSquaresFilled () {
        if (gameSize === by3) {
            for (let square of squaresBy3) {
                if (!square.classList.contains('checked')) {
                    return false;
                }
            }
        } else if (gameSize === by4) {
            for (let square of squaresBy4) {
                if (!square.classList.contains('checked')) {
                    return false;
                }
            }
        }
        return true;
    }

    function afterChecked () {
        if (isThereAWinner()) {
            mainGameEle.classList.add('disabled');
            incrementScore();
            winnerMsg.textContent = currentTurnStr();
        } else if (allSquaresFilled()) {
            mainGameEle.classList.add('disabled');
            winnerMsg.textContent = "It's a draw!";
        }

        updateWhoseTurnMsg();
        whoseTurn = (whoseTurn === userTurn) ? opponentTurn : userTurn;

    }

    function chooseTargetSimple () {
        if (gameSize === by3) {
            let squaresFreeO = [];
            for (let squareBy3 of squaresBy3) {
                if (!squareBy3.classList.contains('checked')) {
                    squaresFreeO.push(Number(squareBy3.dataset.tag));
                }
            }
            let randomIndex = Math.floor(Math.random() * squaresFreeO.length);
            let chosenSquareTag = squaresFreeO[randomIndex];
            for (let squareBy3 of squaresBy3) {
                if (Number(squareBy3.dataset.tag) === chosenSquareTag) {
                    return squareBy3;
                }
            }
            
        } else if (gameSize === by4) {
            let squaresFreeO = [];
            for (let squareBy4 of squaresBy3) {
                if (!squareBy4.classList.contains('checked')) {
                    squaresFreeO.push(Number(squareBy4.dataset.tag));
                }
            }
            let randomIndex = Math.floor(Math.random() * squaresFreeO.length);
            let chosenSquareTag = squaresFreeO[randomIndex];
            for (let squareBy4 of squaresBy4) {
                if (Number(squareBy4.dataset.tag) === chosenSquareTag) {
                    return squareBy4;
                }
            }
        }
        return;


    }

    function chooseTargetSmart () {

    }

// });

