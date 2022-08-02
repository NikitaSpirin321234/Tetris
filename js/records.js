const table = document.getElementById('records');

let records = JSON.parse(localStorage["tetris.records"])['records'];

let lastPlayer = records[records.length - 1];

records.sort((a, b) => {
    return b.score - a.score;
})

let addedRows = [];
for (let row of records) {
    if(addedRows.length >= 10)
        break;
    // Если не добавлена строка с таким именем, добавляем
    if(addedRows.filter(addedRow => row.name === addedRow.name).length === 0){
        console.log("Игрок с таким именем ещё не был найден ранее!");
        let tr = document.createElement('tr');
        tr.id = row.name;
        let name = document.createElement('td');
        let score = document.createElement('td');
        name.textContent = row.name;
        score.textContent = row.score;
        tr.appendChild(name);
        tr.appendChild(score);
        table.appendChild(tr);
        addedRows.push(row);
    }
    // Если уже была добавлена строка с таким именем, проверяем, является ли счет в этой строке лучше
    else if(addedRows.filter(addedRow => row.name === addedRow.name).length !== 0){
        console.log("Игрок с таким именем уже был найден ранее!");
        if(row.score > addedRows.filter(addedRow => row.name === addedRow.name)[0]) {
            console.log("Найден счет лучше прежнего!");
            let tr = document.getElementById(row.name);
            tr.lastElementChild.textContent = row.score;
            for(let addedRow of addedRows)
                if(addedRow.name === row.name)
                    addedRow.score = row.score;
        }
    }
}

let tr = document.createElement('tr');
tr.className = "label-result"
let currentResult = document.createElement('td');
currentResult.colSpan = 2;
currentResult.innerHTML = '<b>Ваш результат</b>';
tr.appendChild(currentResult);
table.appendChild(tr);

tr = document.createElement('tr');
let name = document.createElement('td');
let score = document.createElement('td');
name.textContent = lastPlayer.name;
score.textContent = lastPlayer.score;
tr.appendChild(name);
tr.appendChild(score);
table.appendChild(tr);
