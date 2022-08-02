export default class Game {
    levels = {
        1: 30,
        2: 50,
        3: 80,
        4: 150,
        5: 300
    };
    score = 0;
    lines = 0;
    level = 1;
    field = new GameField();
    activeFigure = this.createFigure();
    nextFigure = this.createFigure();
    isOver = false;


    copyMatrix(matrix){
        const copyHeight = matrix.length;
        const copyWidth = matrix[0].length;
        let copyMatrix = [];
        for(let y = 0; y < copyHeight; y++)
            copyMatrix[y] = new Array(copyHeight).fill(0);
        for(let y = 0; y < copyHeight; y++)
            for(let x = 0; x < copyWidth; x++){
                copyMatrix[y][x] = matrix[y][x];
            }
        return copyMatrix;

    }

    get getState(){
        let state = this.copyMatrix(this.field.matrix);
        const length = this.activeFigure.figure.length;
        const figure = this.activeFigure.figure;
        const figureX = this.activeFigure.x;
        const figureY = this.activeFigure.y;
        for(let y = 0; y < length; y++)
            for(let x = 0; x < length; x++){
                if(figure[y][x] && figureY + y >= 0)
                    state[figureY + y][figureX + x] = figure[y][x];
            }
        return state;
    }

    moveFigureLeft(view) {
        if(this.isOver)
            return;
        view.clearScreen();
        this.activeFigure.x--;
        if(this.isCollision())
            this.activeFigure.x++;
        view.viewGF(this.getState)
    }

    moveFigureRight(view) {
        if(this.isOver)
            return;
        view.clearScreen();
        this.activeFigure.x++;
        if(this.isCollision())
            this.activeFigure.x--;
        view.viewGF(this.getState)
    }

    moveFigureDown(view, viewNextBrick) {
        if(this.isOver)
            return;
        this.activeFigure.y++;
        if(this.isCollision()) {
            this.activeFigure.y--;
            this.fixFigure();
            let clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updateFigures();
            viewNextBrick.clearBrick();
            viewNextBrick.viewB();
        }
        if(this.isCollision()) {
            this.isOver = true;
        }
        else {
            view.clearScreen();
            view.viewGF(this.getState);
        }
    }

    fixFigure(){
        const figure = this.activeFigure.figure;
        const figureY = this.activeFigure.y;
        const figureX = this.activeFigure.x;
        for(let y = 0; y < figure.length; y++)
            for(let x = 0; x < figure[y].length; x++){
                if(figure[y][x] === 1 || figure[y][x] === 2 || figure[y][x] === 3 ||
                    figure[y][x] === 4 || figure[y][x] === 5 || figure[y][x] === 6 ||
                    figure[y][x] === 7) {
                    this.field.matrix[figureY + y][figureX + x] = figure[y][x];
                }
            }
    }

    dropFigure(view, viewNextBrick){
        while(!this.isCollision())
            this.activeFigure.y++;
        this.activeFigure.y--;
        this.fixFigure();
        let clearedLines = this.clearLines();
        this.updateScore(clearedLines);
        this.updateFigures();
        viewNextBrick.clearBrick();
        viewNextBrick.viewB();
        if(this.isCollision()) {
            this.isOver = true;
        }
        else {
            view.clearScreen();
            view.viewGF(this.getState);
        }
    }

    isCollision() {
        const figure = this.activeFigure.figure;
        const field = this.field;
        const figureX = this.activeFigure.x;
        const figureY = this.activeFigure.y;
        for(let y = 0; y < figure.length; y++) {
             for (let x = 0; x < figure[y].length; x++) {
                 if((figureX + x >= field.getWidth || figureX + x < 0
                 || figureY + y >= field.getHeight || figureY + y < 0
                     || field.matrix[figureY + y][figureX + x] === 1 || field.matrix[figureY + y][figureX + x] === 2 ||
                     field.matrix[figureY + y][figureX + x] === 3 || field.matrix[figureY + y][figureX + x] === 4 ||
                     field.matrix[figureY + y][figureX + x] === 5 || field.matrix[figureY + y][figureX + x] === 6 ||
                     field.matrix[figureY + y][figureX + x] === 7)
                    && (figure[y][x] === 1 || figure[y][x] === 2 ||
                     figure[y][x] === 3 || figure[y][x] === 4 || figure[y][x] === 5 ||
                     figure[y][x] === 6 || figure[y][x] === 7))
                     return true;
             }
        }
        return false;
    }

    rotateFigure(view){
        if(this.isOver)
            return;
        view.clearScreen();
        this.rotateFigureRight();
        if(this.isCollision()) {
            this.rotateFigureRight(false)
        }
        view.viewGF(this.getState)
    }

    rotateFigureRight(right = true){
        const figure = this.activeFigure.figure;
        const length = this.activeFigure.figure.length;

        let temp = [];
        for(let y = 0; y < length; y++)
            temp[y] = new Array(length).fill(0);

        if(right) {
            for (let y = 0; y < length; y++)
                for (let x = 0; x < length; x++) {
                    temp[x][y] = figure[length - 1 - y][x];
                }
        }
        else{
            for (let y = 0; y < length; y++)
                for (let x = 0; x < length; x++) {
                    temp[y][x] = figure[x][length - 1 - y];
                }
        }

        this.activeFigure.figure = [];
        this.activeFigure.figure = temp.slice();
    }


    createFigure(){
        const indexType = Math.floor(Math.random() * 7);
        let nextFigure = {};

        switch(indexType){
            case 0:
                nextFigure.figure = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                nextFigure.y = -1;
                break;
            case 1:
                nextFigure.figure = [
                    [0,2,0,0],
                    [0,2,0,0],
                    [0,2,2,0],
                    [0,0,0,0]
                ];
                nextFigure.y = 0;
                break;
            case 2:
                nextFigure.figure = [
                    [0,0,3,0],
                    [0,0,3,0],
                    [0,3,3,0],
                    [0,0,0,0]
                ];
                nextFigure.y = 0;
                break;
            case 3:
                nextFigure.figure = [
                    [4,4,0,0],
                    [0,4,4,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                nextFigure.y = 0;
                break;
            case 4:
                nextFigure.figure = [
                    [0,5,5,0],
                    [5,5,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                nextFigure.y = 0;
                break;
            case 5:
                nextFigure.figure = [
                    [0,0,0,0],
                    [0,6,6,0],
                    [0,6,6,0],
                    [0,0,0,0]
                ];
                nextFigure.y = -1;
                break;
            case 6:
                nextFigure.figure = [
                    [0,7,0,0],
                    [7,7,7,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                nextFigure.y = 0;
                break;
            default:
                throw new Error("Неизвестный тип фигуры!");
        }

        nextFigure.x = Math.floor((this.field.getWidth - nextFigure.figure[0].length) / 2);

        return nextFigure;
    }

    updateFigures(){
        this.activeFigure = this.nextFigure;
        this.nextFigure = this.createFigure();
    }

    clearLines(){
        let matrix = this.field.matrix;
        const height = this.field.getHeight;
        const width = this.field.getWidth;
        let lines = [];

        for(let y = height - 1; y >= 0; y--) {
            let numBlocks = 0;

            for (let x = 0; x < width; x++) {
                if (matrix[y][x])
                    numBlocks++;
            }

            if(numBlocks === width)
                lines.unshift(y);
            else if(numBlocks === 0)
                break;
        }

        for(let line of lines){
            matrix.splice(line, 1);
            matrix.unshift(new Array(width).fill(0));
        }

        return lines.length;
    }

    updateScore(clearedLines){
        if(clearedLines){
            this.lines += clearedLines;
            this.score += clearedLines * this.levels[this.level];
            let oldLevel = this.level;
            if(this.lines < 40)
                this.level = Math.floor(this.lines * 0.1) + 1;
            else
                this.level = 5;

            document.getElementById("score").textContent = "Очки: " + this.score;

            if(oldLevel < this.level){
                document.getElementById("level").textContent = "Текущий уровень: " + this.level;
            }
        }

    }
}

class GameField {
    constructor() {
        this.width = 10;
        this.height = 20;
        this.widthPx = 330;
        this.heightPx = 660;
        this.matrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }
    get getWidth(){
        return this.width;
    }
    get getHeight(){
        return this.height;
    }
    get getWidthPx(){
        return this.widthPx;
    }
    get getHeightPx(){
        return this.heightPx;
    }

    get getBlockWidthPx(){
        return this.widthPx / this.width;
    }
    get getBlockHeightPx(){
        return this.heightPx / this.height;
    }

}
