export default class Control{
    time = 1000;
    timerId = null;

    constructor(game, view, viewNextBrick){
        this.game = game;
        this.view = view;
        this.viewNextBrick = viewNextBrick;
        this.oldLevel = game.level;
        this.startTimer();

        document.addEventListener('keydown', event => {
            const keyName = event.key;
            if(!this.game.isOver) {
                switch (keyName) {
                    case 'ArrowLeft':
                        game.moveFigureLeft(view);
                        this.updateState();
                        break;
                    case 'ArrowUp':
                        game.rotateFigure(view);
                        this.updateState();
                        break;
                    case 'ArrowRight':
                        game.moveFigureRight(view);
                        this.updateState();
                        break;
                    case 'ArrowDown':
                        this.stopTimer();
                        this.updateView(view, viewNextBrick);
                        break;

                }
            }
        });

        document.addEventListener('keypress', event => {
            const keyName = event.key;
            if(!this.game.isOver) {
                switch (keyName) {
                    case ' ':
                        game.dropFigure(view, viewNextBrick);
                        break;
                }
            }
        });

        document.addEventListener('keyup', event => {
            const keyName = event.key;
            if(!this.game.isOver) {
                switch (keyName) {
                    case 'ArrowDown':
                        this.startTimer();
                        break;
                }
            }
        });
    }

    updateView(view, viewNextBrick){
        this.game.moveFigureDown(view, viewNextBrick);
        this.updateState();
    }

    updateState(){
        if(this.game.isOver) {
            this.stopTimer();
            console.log("You lose!");
            this.view.viewGameOverScreen();
            let name = localStorage["tetris.username"];
            let score = this.game.score;

            let json = {
                name: name,
                score: score
            };

            let localRecords = localStorage["tetris.records"];

            if (localRecords === undefined) {
                localRecords = '{"records": []}';
            }

            let records = JSON.parse(localRecords);

            records['records'].push(json);

            localStorage["tetris.records"] = JSON.stringify(records);

            setTimeout(() => {
                window.location = "records.html";
            }, 5000);


        }
        else if(this.game.level > this.oldLevel) {
            this.updateTimer();
            this.oldLevel = this.game.level;
        }

    }

    startTimer() {
        this.timerId = setInterval(() => {
            this.updateView(this.view, this.viewNextBrick);
        }, this.time);
    }

    stopTimer(){
        clearInterval(this.timerId);
        this.timerId = null;
    }

    updateTimer(){
        this.time -= 200;
        clearInterval(this.timerId);
        this.timerId = setInterval(() => {
            this.updateView(this.view, this.viewNextBrick);
        }, this.time);
    }
}