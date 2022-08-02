class View{
    constructor(game){
        this.game = game;
        let name = localStorage["tetris.username"];
        let fullName;
        if(name)
            fullName = "Игрок: " + localStorage["tetris.username"];
        else {
            fullName = "Игрок: Player";
            localStorage["tetris.username"] = "Player";
        }
        document.getElementById("playerName").textContent = fullName;
    }

    viewBlock(context, code, x, y, width, height){
        let backgroundColor = '';
        let strokeColor = '';
        switch (code) {
            case 1:
                backgroundColor = '#15A1D8';
                strokeColor = '#0F85B2';
                break;
            case 2:
                backgroundColor = '#FF7171';
                strokeColor = '#AA5050';
                break;
            case 3:
                backgroundColor = '#FF8AB4';
                strokeColor = '#C65A81';
                break;
            case 4:
                backgroundColor = '#F3ED5D';
                strokeColor = '#B7B123';
                break;
            case 5:
                backgroundColor = '#F2AC57';
                strokeColor = '#BC8542';
                break;
            case 6:
                backgroundColor = '#16BFA3';
                strokeColor = '#0C6C5C';
                break;
            case 7:
                backgroundColor = '#AD55CC';
                strokeColor = '#783A8E';
                break;
            default:
                break;
        }
        if (backgroundColor !== '') {
            context.fillStyle = backgroundColor;
            context.strokeStyle = strokeColor;
            context.strokeWidth = 1;
            context.fillRect(x * width, y * height, width, height);
            context.strokeRect(x * width, y * height, width, height);
        }

    }

}

export class ViewGameField extends View{
    canvas = document.getElementById("glass");
    context = this.canvas.getContext("2d");
    widthOfBlock = this.game.field.getBlockWidthPx;
    heightOfBlock = this.game.field.getBlockHeightPx;

    constructor(game){
        super(game);
    }

    viewGF(state){
        for(let y = 0; y < state.length; y++)
            for(let x = 0; x < state[y].length; x++) {
                let code = state[y][x];
                if (code) {
                    this.viewBlock(this.context, code, x, y, this.widthOfBlock, this.heightOfBlock);
                }
            }
    }

    viewGameOverScreen(){
        this.context.strokeStyle = "#ff3121";
        this.context.shadowColor = "#ff5445";
        this.context.shadowOffsetX = 1;
        this.context.shadowOffsetY = 1;
        this.context.font = "40pt IBM Plex Sans";
        this.context.strokeText("Game over!", 35, 300);
        this.context.font = "22pt IBM Plex Sans";
        this.context.strokeText("Your total score is " + this.game.score, 35, 350);
    }

    clearScreen(){
        this.context.clearRect(0, 0, this.game.field.getWidthPx, this.game.field.getHeightPx);
    }
}

export class ViewNextBrick extends View{
    canvas = document.getElementById("nextBrick");
    context = this.canvas.getContext("2d");
    widthOfBlock = this.game.field.getBlockWidthPx;
    heightOfBlock = this.game.field.getBlockHeightPx;

    constructor(game){
        super(game);
    }

    viewB(){
        let nextFigure = this.game.nextFigure;
        for(let y = 0; y < nextFigure.figure.length; y++)
            for(let x = 0; x < nextFigure.figure.length; x++) {
                let code = nextFigure.figure[y][x];
                if (code === 1 || code === 2 || code === 3)
                    this.viewBlock(this.context, code, x, y + 0.5, this.widthOfBlock, this.heightOfBlock);
                if (code === 4 || code === 5 || code === 7)
                    this.viewBlock(this.context, code, x + 0.5, y + 1, this.widthOfBlock, this.heightOfBlock);
                if (code === 6)
                    this.viewBlock(this.context, code, x, y, this.widthOfBlock, this.heightOfBlock);
            }
    }

    clearBrick(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
