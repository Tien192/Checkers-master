class Tile {
    constructor(board, obj, location) {
        this.board = board;
        this.obj = obj;
        this.location = location;

        //can only play on blue tiles
        if ((this.location[0] + this.location[1]) % 2) {
            this.available = true;
        }
        else {
            this.available = false;
        }

        // adding the onclick handler ... for the tile
        this.obj.addEventListener('click', () => {

            let id = this.obj.getAttribute('id');

            if (this.board[this.location[0]][this.location[1]] == 0) {  // if tile is empty

                console.log("you clicked the tile with id: " + id);

                if ((myGame.turn == 1) && (myGame.selectedChecker != -1) && this.available
                    && myGame.validDiagonalP1(myGame.selectedCheckerLocation, this.location)) { // red

                    document.getElementById(id).style.boxShadow = "inset 0px 0px 15px 5px rgba(110, 188, 224, 0.75)";
                    myGame.saveTile(id, this.location);
                    myGame.moveCheckerP1(myGame.selectedCheckerLocation, this.location);

                } else if ((myGame.turn == 2) && (myGame.selectedChecker != -1) && this.available
                    && myGame.validDiagonalP2(myGame.selectedCheckerLocation, this.location)) {  // blue

                    document.getElementById(id).style.boxShadow = "inset 0px 0px 15px 5px rgba(110, 188, 224, 0.75)";
                    myGame.saveTile(id, this.location);
                    myGame.moveCheckerP2(myGame.selectedCheckerLocation, this.location);

                } else {
                    // mybe tell the user that this is invalid.
                    console.log("not a valid tile.");
                }

            } else {    // color the tile because the checker on it was selected.
                myGame.removeAllGlow();
                console.log("now it's not");
                let x = id + "";
                x = x.replace("tile", "");
                if ((myGame.turn == 1) && (this.board[this.location[0]][this.location[1]] == 1)) {   // red

                    myGame.tileUnderSelectedChecker = x;
                    document.getElementById(id).style.boxShadow = "inset 0px 0px 15px 5px rgba(110, 188, 224, 0.75)";

                } else if ((myGame.turn == 2) && (this.board[this.location[0]][this.location[1]] == 2)) {  // blue
                    myGame.tileUnderSelectedChecker = x;
                    document.getElementById(id).style.boxShadow = "inset 0px 0px 15px 5px rgba(110, 188, 224, 0.75)";
                }
            }
        });
    };

};