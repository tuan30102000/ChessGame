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
function getPosition(row, col, cb) {
    let arr = []

    for (let i = 1; i < 8; i++) {

        let result = cb(row, col, i)
        console.log(result)
        if (!result) break
        result.canMove && arr.push(result.square)
        if (!result.next) break
    }
    return arr


}
// getListPositionMove(row, col) {
//     let arr = []
//     this.currentTarget.moveFunc.forEach(item => {
//         console.log(getPosition(row, col, item.bind(this)))
//         arr = [...arr, ...getPosition(row, col, item.bind(this))]
//     })

// }



const chessData = [
    {
        name: 'queen',
        position: createPositionForDoubleTeam(createSinglePosition, 4)
        , move: [checkDiagonalBotLeft, checkDiagonalBotRight, checkDiagonalTopRight, checkDiagonalTopLeft, checkBot, checkTop, checkLeft, checkRight]
    },
    {
        name: 'king',
        position: createPositionForDoubleTeam(createSinglePosition, 5)
        , move: [checkDiagonalBotLeft, checkDiagonalBotRight, checkDiagonalTopRight, checkDiagonalTopLeft, checkBot, checkTop, checkLeft, checkRight]

    },
    {
        name: 'bishop',
        position: createPositionForDoubleTeam(createSymmetryPosition, 3)
        , move: [checkDiagonalBotLeft, checkDiagonalBotRight, checkDiagonalTopRight, checkDiagonalTopLeft]
    },
    {
        name: 'knight',
        position: createPositionForDoubleTeam(createSymmetryPosition, 2)
        , move: [checkBotLKn, checkBotRKn, checkTopLKn, checkTopRKn, checkLeftBKn, checkLeftTKn, checkRightBKn, checkRightTKn]
    },
    {
        name: 'castle',
        position: createPositionForDoubleTeam(createSymmetryPosition, 1)
        , move: [checkBot, checkTop, checkLeft, checkRight]
    },
    {
        name: 'pawn',
        position: createPositionForDoubleTeam(createPositionPawn)
        , move: [checkOxPawn, checkLeftPawn, checkRightPawn]
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
    changeCurrentTurn() {
        this.currentTurn = this.currentTurn == 'white' ? 'black' : 'white'
    }

}

function checkDiagonalTopLeft(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - i, row - i)

    if (squareCheck) return { ...squareCheck.checkPiece(checkNextDiagonal), square: squareCheck, type: 'tl' }
}
function checkDiagonalTopRight(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + i, row - i)

    if (squareCheck) return { ...squareCheck.checkPiece(checkNextDiagonal), square: squareCheck, type: 'tr' }
}
function checkDiagonalBotLeft(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - i, row + i)

    if (squareCheck) return { ...squareCheck.checkPiece(checkNextDiagonal), square: squareCheck, type: 'bl' }
}
function checkDiagonalBotRight(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + i, row + i)
    if (squareCheck) return { ...squareCheck.checkPiece(checkNextDiagonal), square: squareCheck, type: 'br' }
}
function checkNextDiagonal(row, col) {
    if (row == 8) return false
    if (col == 8) return false
    if (row == 1) return false
    if (col == 1) return false
    return true
}
function checkNextOy(row, col) {
    if (row == 8) return false
    if (row == 1) return false
    return true
}
function checkNextOx(row, col) {
    if (col == 8) return false
    if (col == 1) return false
    return true
}
//ahead
function checkTop(row, col, i) {
    const squareCheck = this.findBoadItemElm(col, row + i)

    if (squareCheck) return { ...squareCheck.checkPiece(checkNextOy), square: squareCheck, type: 't' }
}
function checkBot(row, col, i) {
    const squareCheck = this.findBoadItemElm(col, row - i)

    if (squareCheck) return { ...squareCheck.checkPiece(checkNextOy), square: squareCheck, type: 'b' }
}
function checkLeft(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - i, row)

    if (squareCheck) return { ...squareCheck.checkPiece(checkNextOx), square: squareCheck, type: 'l' }
}
function checkRight(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + i, row)
    if (squareCheck) return { ...squareCheck.checkPiece(checkNextOx), square: squareCheck, type: 'r' }
}
function checkOxPawn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col, this.currentTarget.firtRow == 2 ? row + i : row - i)
    const resultCheck = squareCheck?.checkPiece()
    if (!resultCheck) return
    if (this.currentTarget.row === this.currentTarget.firtRow) {
        return { ...resultCheck, next: i < 2, square: squareCheck, type: 'px', canMove: !resultCheck.havePiece }
    }
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'px', canMove: !resultCheck.havePiece }
}
function checkRightPawn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + i, this.currentTarget.firtRow == 2 ? row + i : row - i)
    const resultCheck = squareCheck?.checkPiece()
    if (!resultCheck) return
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'pr', canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team }
}
function checkLeftPawn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - i, this.currentTarget.firtRow == 2 ? row + i : row - i)
    const resultCheck = squareCheck?.checkPiece()
    if (!resultCheck) return
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'pk', canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team }
}
function checkTopRKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + 1, row - 2)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'kntr',/*  canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team  */}

}
function checkTopLKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - 1, row - 2)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'kntl', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }

}
function checkBotRKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + 1, row + 2)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'knbr', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }
}
function checkBotLKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - 1, row + 2)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'knbl', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }
}
function checkRightTKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + 2, row - 1)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'knr', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }
}
function checkRightBKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col + 2, row + 1)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'knr', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }
}
function checkLeftTKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - 2, row - 1)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'knlt', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }
}
function checkLeftBKn(row, col, i) {
    const squareCheck = this.findBoadItemElm(col - 2, row + 1)
    const resultCheck = squareCheck?.checkPiece()
    if (squareCheck) return { ...resultCheck, next: false, square: squareCheck, type: 'knlb', /* canMove: resultCheck.havePiece && squareCheck.piece.team !== this.currentTarget.team */ }
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
                this.pieces.push(new piece(item.name, team, position.row, position.col, item.move, this))
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
    clearTarget() {
        this.currentTarget = null
    }
    clearCanmove() {
        this.listBoardSquare.filter(item => item.canMove).forEach(item => item.clearActiveCanmove())
    }
    getListPositionMove(row, col) {
        this.clearCanmove()
        let arr = []
        this.currentTarget.moveFunc.forEach((item, i) => {
            // console.log(getPosition(row, col, item.bind(this)),i)
            arr = [...arr, ...getPosition(row, col, item.bind(this))]
        })
        // console.log(arr)
        arr.forEach(item => item.addActiveCanmove())

    }
    findSquareHavePiece(piece) {
        return this.listBoardSquare.find(item => item.piece === piece)
    }
}


class piece {
    constructor(name, team, row, col, moveFunc, board) {
        this.name = name
        this.team = team
        this.row = row
        this.col = col
        this.firtRow = row
        this.status = 'in'
        this.board = board
        this.moveFunc = moveFunc
        this.src = `./image/${team}/${name}.png`
        this.createElement()
        this.handleEvent()
    }
    changePosition(row, col) {
        this.row = row
        this.col = col
        this.board.findSquareHavePiece(this)?.removePiece()
        this.board.findBoadItemElm(col, row).addPiece(this)
    }

    createElement() {
        this.elm = document.createElement('div')
        const imgElm = document.createElement('img')
        imgElm.src = this.src
        this.elm.classList.add('piece')
        this.elm.appendChild(imgElm)
    }

    checkTurn() {
        return this.board.game.currentTurn == this.team
    }
    handleEvent() {
        this.elm.addEventListener('click', (() => {
            if (!this.checkTurn()) return
            this.board.changeCurrentTarget(this)
            this.elm.classList.add('active')
            this.board.getListPositionMove(this.row, this.col)
        }).bind(this))
    }

}

class boardSquare {
    constructor(col, row, board) {
        this.board = board
        this.col = col
        this.row = row
        this.color = this.row % 2 == 0 ? (this.col % 2 == 0 ? 'white' : 'black') : (this.col % 2 !== 0 ? 'white' : 'black')
        this.createElement()
        this.handleEvent()
    }
    createElement() {
        this.elm = document.createElement('li')
        this.elm.classList.add(this.color)
        this.elm.setAttribute('col', this.col)
        this.elm.setAttribute('row', this.row)
        this.row == 1 && this.elm.classList.add('bd-t')
        this.col == 8 && this.elm.classList.add('bd-r')
    }


    addPiece(piece) {
        this.piece = piece
        this.elm.appendChild(piece.elm)
    }
    removePiece() {
        this.piece = null
        // this.elm.appendChild(piece.elm)
    }
    //  (this.piece.col != 8 && this.piece.row != 8) && (this.piece.col != 1 && this.piece.row != 1) 
    checkPiece(cb) {
        // if (this.board.currentTarget.type == 'pawn') {
        // }
        if (!this.piece) return { canMove: true, next: this.board.currentTarget.name == 'king' ? false : (cb && cb(this.row, this.col)), havePiece: false, }
        return { canMove: this.piece.team !== this.board.currentTarget.team, next: false, havePiece: true, team: this.piece.team }
    }
    addActiveCanmove() {
        this.canMove = true
        this.elm.classList.add('active-canmove')
    }
    clearActiveCanmove() {
        this.canMove = false
        this.elm.classList.remove('active-canmove')
    }
    handleEvent() {
        this.elm.addEventListener('click', (() => {
            if (!this.canMove) return
            this.board.currentTarget.changePosition(this.row, this.col)
            this.board.changeCurrentTarget(null)
            this.board.clearCanmove()
            this.board.game.changeCurrentTurn()
        }).bind(this))
    }
}
const chessGame = new game()










