
class Move {
    constructor(pastlocation, nextlocation, player, jump) {
        this.pastlocation = pastlocation;
        this.nextlocation = nextlocation;
        this.player = player;
        this.score = 0;
        this.jump = jump;
    };

    findTilesANDCheckers() {
        let x = parseInt((this.pastlocation[0] * 8)) + parseInt(this.pastlocation[1]);
        myGame.tileUnderSelectedChecker = x;
        x = parseInt((this.nextlocation[0] * 8)) + parseInt(this.nextlocation[1]);
        myGame.selectedTile = x;

        myGame.selectedCheckerLocation = this.pastlocation;
        myGame.selectedTileLocation = this.nextlocation;
    };
};


class Board {

    constructor() {
        this.size = 8;
        this.lastMove;
        this.board = this.Init();
        this.tiles = [];
        this.checkers = [];
        this.kingsList = [];

    };

    Init() {
        let board = [];
        let even = true;

        for (let i = 0; i < this.size; i++) {
            board[i] = [];

            for (let j = 0; j < this.size; j++) {
                if (i == 1 && even) {
                    board[i][j] = 1;
                }
                else if ((i == 0 || i == 2) && !even) {
                    board[i][j] = 1;
                }
                else if (i == 6 && !even) {
                    board[i][j] = 2;
                }
                else if ((i == 5 || i == 7) && even) {
                    board[i][j] = 2;
                }
                else {
                    board[i][j] = 0;
                }
                even = !even;
            }
        }

        // board = [
        //     [0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0],
        //     [0, 1, 0, 1, 0, 1, 0, 1],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [2, 0, 2, 0, 2, 0, 2, 0],
        //     [0, 2, 0, 2, 0, 2, 0, 2],
        //     [2, 0, 2, 0, 2, 0, 2, 0]];

        return board;
    };

    // 0 1 0 1 0 0    0,3 -> 2,1 jump 1,2 down left
    // 0 0 2 0 2 0    0,3 -> 2,5 jump 1,4 down right
    // 0 0 0 1 0 0    4,3 -> 2,1 jump 3,2 up left
    // 0 0 2 0 2 0    4,3 -> 2,5 jump 3,4 up right
    // 0 1 0 1 0 0

    DrawBoard() {
        let tilesDiv = document.querySelector('div.tiles');
        let tilesCount = 0;
        let chekersCount = 0;

        for (let row in this.board) {
            let line = document.createElement('div');
            line.classList.add('tileRow');

            for (let col in this.board[row]) {

                let tile = document.createElement('div');
                tile.classList.add('tile');
                tile.setAttribute('id', 'tile' + tilesCount);

                // the function needs implementation
                // tile.addEventListener('click', gameManager.Select);

                line.appendChild(tile);
                this.tiles[tilesCount] = new Tile(this.board, tile, [+row, +col]);
                tilesCount++;

                //cheker
                let checker = document.createElement('div');
                checker.classList.add('checker');
                checker.setAttribute('id', chekersCount);
                //<i class="fas fa-crown"></i>
                //let icon = document.createElement('i');
                //icon.classList.add('fas', 'fa-crown', 'fa-2x');
                //checker.appendChild(icon);

                if (this.board[row][col] === 1) {
                    checker.classList.add('red');
                    tile.appendChild(checker);
                    let tem = new Checker(this.board, checker, [+row, +col], chekersCount);
                    this.checkers[chekersCount] = tem;
                    chekersCount++;
                    if (isKing(1, [row, col], currBoard.kingsList)) {
                        let icon = document.createElement('i');
                        icon.classList.add('fas', 'fa-crown', 'fa-2x','king');
                        checker.appendChild(icon);
                        checker.appendChild(icon);
                    }
                } else if (this.board[row][col] === 2) {
                    checker.classList.add('blue');
                    tile.appendChild(checker);
                    let tem = new Checker(this.board, checker, [+row, +col], chekersCount);
                    this.checkers[chekersCount] = tem;
                    chekersCount++;
                    if (isKing(2, [row, col], currBoard.kingsList)) {
                        let icon = document.createElement('i');
                        icon.classList.add('fas', 'fa-crown', 'fa-2x','king');
                        checker.appendChild(icon);
                        checker.appendChild(icon);
                    }
                }
            }

            tilesDiv.appendChild(line);
        }
    };

    reDrawBoard() {
        // Removes an element from the document
        let element = document.getElementsByClassName("tiles");
        console.log(element);
        // element[0].remove();
        // return false;
        while (element[0].firstChild) {
            element[0].removeChild(element[0].lastChild);
        }

        this.DrawBoard()
    };
};