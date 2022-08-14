const _ = 'x'
const WIDTH_BOARD = 8
const createPosition = (x, y) => {
    return { row: x, col: y }
}





function createPositionPawn(team) {
    const row = team == 'black' ? 2 : 7
    const arr = []
    for (let i = 1; i <= WIDTH_BOARD; i++) {
        arr.push(createPosition(row, i))
    }
    return arr
}

function createSymmetryPosition(team, number) {
    const row = team == 'black' ? 1 : 8
    return [createPosition(row, number), createPosition(row, WIDTH_BOARD - number + 1)]
}

function createSinglePosition(team, number) {
    const row = team == 'black' ? 1 : 8
    return [createPosition(row, number)]
}

function createPositionForDoubleTeam(callback, callbackProp) {
    return {
        black: [...callback('black', callbackProp)],
        white: [...callback('white', callbackProp)],
    }

}
function getPositionDiagonal(row, col, cb) {
    let arr = []

    for (let i = 0; i < 8; i++) {
        let result = cb(row, col, i)
        result.canMove && arr.push(result.piece)
        if (!result.next) break

    }

    return arr


}




const chessData = [
    {
        name: 'queen',
        position: createPositionForDoubleTeam(createSinglePosition, 4)
    },
    {
        name: 'king',
        position: createPositionForDoubleTeam(createSinglePosition, 5)
    },
    {
        name: 'bishop',
        position: createPositionForDoubleTeam(createSymmetryPosition, 3)
    },
    {
        name: 'knight',
        position: createPositionForDoubleTeam(createSymmetryPosition, 2)
    },
    {
        name: 'castle',
        position: createPositionForDoubleTeam(createSymmetryPosition, 1)
    },
    {
        name: 'pawn',
        position: createPositionForDoubleTeam(createPositionPawn)
    },

]


const createArr = (length, cb) => {
    const arr = []
    for (let i = 0; i < length; i++) {
        arr.push(cb(i))
    }
    return arr
}

const countToPosition = (i) => {
    return {
        y: i % WIDTH_BOARD ? i % WIDTH_BOARD : 8,
        x: Math.ceil(i / WIDTH_BOARD)
    }
}

class game {
    constructor() {
        this.gameElm = document.getElementById('game')
        this.board = new board(this)
        this.appendBoard()
        this.currentTurn = 'white'
    }
    appendBoard() {
        this.gameElm.appendChild(this.board.boardElm)
    }

}

class board {
    constructor(game) {
        this.pieces = []
        this.game = game
        this.currentTarget = null
        this.createBoard()
        this.createListBoardSquare()
        this.addItemToBoard()
        this.createPieceDoubleTeam()
        this.renderPiece()
    }
    createBoard() {
        this.boardElm = document.createElement('ul')
        this.boardElm.id = 'board'
    }
    createListBoardSquare() {
        const callback = (i) => {
            const position = countToPosition(i + 1)
            return new boardSquare(position.y, position.x, this)
        }
        this.listBoardSquare = createArr(WIDTH_BOARD * WIDTH_BOARD, callback)
    }
    addItemToBoard() {
        this.listBoardSquare.forEach(item => this.boardElm.appendChild(item.elm))
    }
    createPiecesEachTeam(team) {
        chessData.forEach((item) => {
            item.position[team].forEach((position) => {
                this.pieces.push(new piece(item.name, team, position.row, position.col, this))
            })
        })
    }
    createPieceDoubleTeam() {
        this.createPiecesEachTeam('black')
        this.createPiecesEachTeam('white')
    }
    renderPiece() {
        this.pieces.forEach(item => this.findBoadItemElm(item.col, item.row).addPiece(item))
    }
    findBoadItemElm(col, row) {
        return this.listBoardSquare.find(item => item.col == col && item.row == row)
    }
    changeCurrentTarget(piece) {
        this.currentTarget = piece
        document.querySelector('.piece.active')?.classList.remove('active')
    }
}


class piece {
    constructor(name, team, row, col, board) {
        this.name = name
        this.team = team
        this.row = row
        this.col = col
        this.status = 'in'
        this.board = board
        this.src = `./image/${team}/${name}.png`
        this.createElement()
        this.handleEvent()
    }
    createElement() {
        this.elm = document.createElement('div')
        const imgElm = document.createElement('img')
        imgElm.src = this.src
        this.elm.classList.add('piece')
        const overplay = document.createElement('div')
        overplay.classList = 'piece-overplay'
        this.elm.appendChild(imgElm)
        this.elm.appendChild(overplay)
    } x

    checkTurn() {
        return this.board.game.currentTurn == this.team
    }
    handleEvent() {
        this.elm.addEventListener('click', (() => {
            if (!this.checkTurn()) return
            this.board.changeCurrentTarget(this)
            this.elm.classList.add('active')
        }).bind(this))
    }
}

class boardSquare {
    constructor(col, row, board) {
        this.board = board
        this.col = col
        this.row = row
        this.color = this.row % 2 == 0 ? (this.col % 2 == 0 ? '#fff' : '#000') : (this.col % 2 !== 0 ? '#fff' : '#000')
        this.createElement()
    }
    createElement() {
        this.elm = document.createElement('li')
        this.elm.style.backgroundColor = this.color
        this.elm.setAttribute('col', this.col)
        this.elm.setAttribute('row', this.row)
    }
    addPiece(piece) {
        this.piece = piece
        this.elm.appendChild(piece.elm)
    }
    removePiece() {
        this.piece = null
        this.elm.appendChild(piece.elm)
    }
    checkPiece() {
        if (!this.piece) return { canMove: true, next: this.piece.col != 8 && this.piece.row != 8 }
        if (this.piece && this.piece.team !== this.board.piece.team) return { canMove: true, next: this.piece.col != 8 && this.piece.row != 8 }
        if (this.piece && this.piece.team == piece.team) return { canMove: false, next: false }
    }
}
const chessGame = new game()










