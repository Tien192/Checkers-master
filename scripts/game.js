
window.setInterval(function () {
    myGame.AIturn();
}, 2000);


class Game {
    constructor() {
        this.turn = 0;     // 1: palyer1, 2: palyer2
        this.AI = false; //by default two players
        this.selectedChecker = -1;  // for the id of the selected checker
        this.tileUnderSelectedChecker = -1;
        this.selectedCheckerLocation = [-1, -1];
        this.selectedTile = -1;
        this.selectedTileLocation = [-1, -1];
        this.winner = 0;
        this.playerMove;
        this.thinking = false;
        this.isDoubleMode = false;

        
        this.player1Time = 90;
        this.player2Time = 90;
        this.timerInterval;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.turn === 1) {
                this.player1Time--;
                document.getElementById("redtimer").innerHTML = this.formatTime(this.player1Time);
            } else if (this.turn === 2) {
                this.player2Time--;
                document.getElementById("bluetimer").innerHTML = this.formatTime(this.player2Time);
            }
            if (this.player1Time <= 0) {
                this.endGame(2); // Player 2 wins when player 1's time runs out
            } else if (this.player2Time <= 0) {
                this.endGame(1); // Player 1 wins when player 2's time runs out
            }
        }, 1000); // Update every 1 second
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    moveCheckerP1(locC, locT) {
        if (!this.AI) {
            
            console.log(this.turn);
            //currBoard.board[locC[0]][locC[1]] = 0;
            //currBoard.board[locT[0]][locT[1]] = 1;
            let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 1);
            let tem = findMovePlayer(locC, locT, temMvs);
            makeMoveAI(currBoard.board, currBoard.kingsList, tem, 1);
            this.next(tem);

            if (noMoreMoves(currBoard.board, currBoard.kingsList, 2)) {
                this.winner = 1;
                document.getElementById("winner").innerHTML = "Red won!";
                this.display_winner();
                return;
            }

        }
        this.resetTimer();
    };

    moveCheckerP2(locC, locT) {

        console.log(this.turn);
        //currBoard.board[locC[0]][locC[1]] = 0;
        //currBoard.board[locT[0]][locT[1]] = 2;

        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 2);
        let tem = findMovePlayer(locC, locT, temMvs);
        makeMoveAI(currBoard.board, currBoard.kingsList, tem, 2);
        this.next(tem);
        
        if (noMoreMoves(currBoard.board, currBoard.kingsList, 1)) {
            this.winner = 2;
            document.getElementById("winner").innerHTML = "Blue won!";
            this.display_winner();
            return;
        }
        this.resetTimer();
    };

    resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startTimer();
    }
    endGame(winner) {
        this.winner = winner;
        document.getElementById("winner").innerHTML = winner === 1 ? "Red" : "Blue" + " won on time!";
        this.display_winner();
        clearInterval(this.timerInterval);
    }

    validDiagonalP1(locC, locT) { // red - moves down
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 1);
        return isValidMove(locC, locT, temMvs);
    };

    validDiagonalP2(locC, locT) {   // blue - moves up
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 2);
        console.log("moooves");
        console.log(temMvs);
        return isValidMove(locC, locT, temMvs);
    };

    AIturn(){
        if(this.AI && (this.turn == 1) && !this.thinking){
            this.moveAI();
        }
    }

    moveAI() {
        
        console.log("turn" + this.turn);
        this.thinking = true;
        let tem = null;
        if(this.isDoubleMode){
            console.log("it's double AI");
            let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
            console.log(temMvs.length);
            console.log(this.selectedCheckerLocation[0] + " " + this.selectedCheckerLocation[1]);
            for (let i = 0; i < temMvs.length; i++) {   
                if ((temMvs[i].pastlocation[0] == this.selectedCheckerLocation[0]) && (temMvs[i].pastlocation[1] == this.selectedCheckerLocation[1])) {
                    console.log("AI double");
                    tem = temMvs[i];
                    break;
                }
            }

        }
        else{
            console.log("not double AI");
            tem = AInextMove();
        }
        if(tem.jump) console.log("last loc: "+tem.pastlocation+"    next loc: "+tem.nextlocation);

        tem.findTilesANDCheckers();
        makeMoveAI(currBoard.board, currBoard.kingsList, tem, 1);
        this.next(tem);

        //console.log(noMoreMoves(currBoard.board, currBoard.kingsList, 2));
        if(noMoreMoves(currBoard.board, currBoard.kingsList, 2)){
            console.log("game ended");
            this.winner = 1;
            document.getElementById("winner").innerHTML = "Red won!";
            this.display_winner();
            return;
        }
    }
    next(lastMove) {

        currBoard.reDrawBoard();

        let x = this.tileUnderSelectedChecker.toString();
        x = x.replace("tile", "");
        document.getElementById("tile" + x).style.boxShadow = "inset 0px 0px 15px 5px rgba(110, 188, 224, 0.75)";
       
        x = this.selectedTile.toString();
        x = x.replace("tile","");
        document.getElementById("tile" + x).style.boxShadow = "inset 0px 0px 15px 5px rgba(110, 188, 224, 0.75)";

        if (this.isDoubleJump() && lastMove.jump) {
            this.turn = (this.turn == 1) ? 1 : 2;
            // selected checker must remains the same.
            this.selectedCheckerLocation = this.selectedTileLocation;
            this.isDoubleMode = true;
        } else {
            this.turn = (this.turn == 1) ? 2 : 1;
            this.selectedCheckerLocation = [-1, -1];
            this.isDoubleMode = false;
        }
        this.selectedChecker = -1;  // appearantly the id changes with each render...
        this.tileUnderSelectedChecker = -1;
        this.selectedTileLocation = [-1, -1];
        this.selectedTile = -1;
        // currBoard.reDrawBoard();
        console.log("next turn " + this.turn);
        this.thinking = false;
        this.update_count_display();
        if(this.turn == 1){
            document.getElementById("turn").innerHTML = "RED turn";
        }
        else{
            document.getElementById("turn").innerHTML = "BLUE turn";
        }
    }
    

    onePlayer() {
        this.AI = true;
        this.turn = 2;
        this.display();
        
    }
    twoPlayers() {
        this.AI = false;
        this.turn = 2;
        this.display();
    }
    display (){
        document.getElementById("two").style.display = "none";
        document.getElementById("one").style.display = "none";
        document.getElementById("start").innerHTML = "Good Luck!";
        document.getElementById("red").style.display = "block";
        document.getElementById("blue").style.display = "block";
        document.getElementById("turn").style.display = "block";
        document.getElementById("turn").innerHTML = "BLUE turn";
        document.getElementById("redtimer").style.display = "block";
        document.getElementById("bluetimer").style.display = "block";
    }
    display_winner(){
        console.log("game ended");
        this.turn = 0;
        document.getElementById("winner").style.display = "block";
        document.getElementById("winneri").style.display = "block";
        document.getElementById("start").style.display = "none";

        clearInterval();
    }

    update_count_display (){
        
        document.getElementById("redcount").innerHTML = noTiles(currBoard.board, 1);
        document.getElementById("bluecount").innerHTML = noTiles(currBoard.board, 2);

    }

    saveChecker(id, loc) {
        this.selectedChecker = id;
        this.selectedCheckerLocation = loc;
        // document.getElementById(id).style = ""
    }

    saveTile(id, loc) {
        this.selectedTile = id;
        this.selectedTileLocation = loc;
    }

    isDoubleJump() {
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
        if (temMvs.length != 0) {
            if ((temMvs[0].jump)) {   // if the first one is jump, then all the list is possible jumps for the player
                for (let i = 0; i < temMvs.length; i++) {   // just check if the jumps are double or not ...

                    if ((temMvs[i].pastlocation[0] == this.selectedTileLocation[0]) && (temMvs[i].pastlocation[1] == this.selectedTileLocation[1])) {
                        console.log("it's double, yeah!");
                        return true;
                    }
                }
            }
        }
        return false;
    }

    removeAllGlow() {
        for (let i = 0; i < 64; i++) {
            document.getElementById("tile" + i).style.boxShadow = "";
        }
    }
}

// function whatever() {
//     console.log("hi");
//     currBoard.board=[
//             [0, 1, 0, 1, 0, 1, 0, 1],
//             [0, 0, 1, 0, 1, 0, 1, 0],
//             [0, 1, 0, 1, 0, 1, 0, 1],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [2, 0, 2, 0, 2, 0, 2, 0],
//             [0, 2, 0, 2, 0, 2, 0, 2],
//             [2, 0, 2, 0, 2, 0, 2, 0]];

//     currBoard.reDrawBoard();
// };

