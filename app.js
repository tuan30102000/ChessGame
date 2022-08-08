const _ = 'x'
const WIDTH_BOARD = 8
const createArr = (length, cb) => {
    const arr = []
    for (let i = 0; i < length; i++) {
        arr.push(cb(i))
    }
    return arr
}

const countToPosition = (i) => {
    return {
        x: i % WIDTH_BOARD ? i % WIDTH_BOARD : 8,
        y: Math.ceil(i / WIDTH_BOARD)
    }
}

class game {
    constructor() {
        this.gameElm = document.getElementById('game')
        this.board = new board()
        this.appendBoard()
    }
    appendBoard() {
        this.gameElm.appendChild(this.board.boardElm)
    }

}

class board {
    constructor() {
        this.createBoard()
        this.createListBoardItem()
        this.addItemToBoard()
    }
    createBoard() {
        this.boardElm = document.createElement('ul')
        this.boardElm.id = 'board'
    }
    createListBoardItem() {
        const callback = (i) => {
            const position = countToPosition(i + 1)
            return new boardItem(position.y, position.x)
        }
        this.listBoardItem = createArr(WIDTH_BOARD * WIDTH_BOARD, callback)
    }
    addItemToBoard() {
        this.listBoardItem.forEach(item => this.boardElm.appendChild(item.elm))
    }
    findBoadItemElm(col, row) {

    }
}

class chessItem {
    constructor(type, team) {
        this.type = type
        this.team = team
    }
}

class boardItem {
    constructor(col, row) {
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
}
const chessGame = new game()