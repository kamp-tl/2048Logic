let board = [];
let autoPlay = false;
let intervalIndex = null;
function initialize() {
    board = [];
    for (let i = 0; i < 4; i++) {
        board[i]=[];
        for (let j= 0; j < 4; j++) {
        board[i][j] = 0;
       }
    }
}
function addRandomTile() {
    let empty = [];
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if (board[i][j] === 0) {
                empty.push([i,j])
            }
        }
    }

    if (empty.length === 0) {
        return;
    }
    let randomIndex = Math.floor(Math.random() * empty.length);
    let [row,col] = empty[randomIndex];
    let tileValue = (Math.random() < 0.9) ? 2 : 4;
    board[row][col] = tileValue;
}
function renderBoard() {
    let cells = document.querySelectorAll('.cell')
    for (let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            let index = i * 4 + j;
            let cell = cells[index];
            let value = board[i][j];
            cell.textContent = value;
        }
    }
}
function moveLeft(b) {
    for (let i=0;i<4;i++){
        let row = b[i];
        let newRow = row.filter(tile => tile !== 0)    
        for (let j=0;j<newRow.length-1;j++) {
            if (newRow[j] === newRow[j+1]) {
                newRow[j] *= 2;
                newRow[j+1] = 0;
                j++
            }
         }
        newRow = newRow.filter(tile => tile!= 0);
        while (newRow.length < 4){newRow.push(0)};
        b[i] = newRow;
    }
    // console.table(board);
}
function moveRight(b) {
    for (let i=0;i<4;i++){
        let row = b[i];
        let newRow = row.filter(tile => tile !== 0)    
        
        while (newRow.length < 4) {newRow.unshift(0)};
        for (let j=3;j>0;j--) {
            if (newRow[j] === newRow[j-1]) {
                newRow[j] *= 2;
                newRow[j-1] = 0;
                j--;
            }    
        }
        newRow = newRow.filter(tile => tile!= 0);
        while (newRow.length < 4) {newRow.unshift(0);}
        b[i] = newRow;
    }  
    // console.table(board); 
}
function moveUp (b) {
    for (let j=0;j<4;j++){
        let col =  [];
        for (let i = 0;i<4;i++){
            col.push(b[i][j]);
        }
        let newCol = col.filter(tile => tile !== 0)
        for(let i=0;i<newCol.length-1;i++){
            if (newCol[i] === newCol[i+1]) {
                newCol[i] *= 2;
                newCol[i+1] = 0;
                i++
            }
        }
        newCol = newCol.filter(tile => tile!= 0);
        while (newCol.length < 4) {newCol.push(0);}
        for (let i=0;i<4;i++){
            b[i][j] = newCol[i]
        }
    }
    // console.table(board);
}
function moveDown (b) {
    for (let j=0;j<4;j++){
        let col =  [];
        for (let i = 0;i<4;i++){
            col.push(b[i][j]);
        }
        let newCol = col.filter(tile => tile !== 0)
        while (newCol.length < 4) {newCol.unshift(0);}
        for(let i=newCol.length-1;i>0;i--){
            if (newCol[i] === newCol[i-1]) {
                newCol[i] *= 2;
                newCol[i-1] = 0;
                i--;
            }
        }
        newCol = newCol.filter(tile => tile!= 0);
        while (newCol.length < 4) {newCol.unshift(0);}
        for (let i=0;i<4;i++){
            b[i][j] = newCol[i]
        }
    }
    // console.table(board);
}
function scoreBoard(b) {  
    let score = 0;
    let emptyCount = 0; 
    
    let corner = [b[3][0]];
    
    //lower score if highest tile not in corner 
    let maxTile = Math.max(...b.flat());
    if (corner.includes(maxTile)) {
        score += 0;
    } else {
        score -= 1000;
    }
    //raise score for empty squares
    for (let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if (b[i][j]===0){
                emptyCount++;
            }
        }
    }
    score += emptyCount * 105;
    //raise scores for smaller jumps between tiles , "smoothness"
    for (let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if (i<3){score -= Math.abs(b[i][j] - b[i+1][j])}
            if (j<3){score -= Math.abs(b[i][j] - b[i][j+1])}
        }
    }
    //raise score to flow towards the bottom left
    // for (let i=0;i<4;i++){
    //     if (i===0||i===2){
    //         if (b[i].includes(0)){
    //             for (let j=0;j<3;j++){
    //                 let current = b[i][j];
    //                 let next = b[i][j+1];
    //                 if (current < next) {
    //                     score -= (next - current);
    //                 }
    //                 else if (current===next){
    //                     score -= (next + current);
    //                 }
    //             }
    //         }
    //         else {
    //             for (let j=0;j<3;j++){
    //                 let current = b[i][j];
    //                 let next = b[i][j+1];
    //                 if (current > next) {
    //                 score -= (next - current);
    //                 }
    //                 else if (current===next){
    //                     score -= (next+ current);
    //                 }
    //             }
    //         }
    //     }
        
    // }
    //follow the snake 
    let snakePath = [
        12, 13, 14, 15,
        11, 10, 9, 8,
        4, 5, 6, 7,
        3, 2, 1, 0
    ]
    let flatBoard = b.flat() 
    let rearranged = snakePath.map(index => flatBoard[index])
    for(let i=0;i<15;i++){
        if (rearranged[i] > rearranged[i+1]) {
            score += (2*rearranged[i])
        }
        else {
            score -= (rearranged[i+1])
        }
    }
    for (let i=0;i<4;i++){
        if(i%2===0){
            for (let j=0;j<4;j++){
                if(b[i][j]<=b[i][j+1]){
                    score-=b[i][j+1]-b[i][j]
                }  
            }
            }
        
        if(i%2===1){
            for (let j=0;j<4;j++){
                if(b[i][j]<=b[i][j+1]){
                    score+=b[i][j+1]-b[i][j]
                }
            }
        }
        if(b[0][3]!=0 && b[0][3] != b[0][2]){
                corner[0] = [b[1][3]]
        }
        else if(b[1][0]!=0 && b[1][0] != b[1][1]){
                corner[0] = [b[2][0]]
        }
        else if(b[2][3]!=0 && b[2][3] != b[2][2]){
            corner[0] = [b[3][3]]
        }
        else {
            corner[0] = [b[3][0]]
        }
    }
    //lower score if there are larger tiles on higher rows 
    let diff = 0;
    for (let i=0;i<3;i++){
        for (let j=0;j<4;j++){
            if (b[i][j] >= b[i+1][j]){
                diff = b[i][j] - b[i+1][j]
                score -= (diff);
            }
        }
    }
    //lower score if there are tiles in the wrong lateral
    let latDiff = 0;
    for (let i=0;i<4;i++){
        if (i%2===0){ 
            for (let j=0;j<2;j++) { 
                if (b[i][j+1] >= b[i][j]){
                    latDiff = b[i][j+1]-b[i][j];
                    score-=latDiff;
                }
            }
        }
        if (i%2===1){
            for (let j=0;j<2;j++) { 
                if (b[i][j+1] <= b[i][j]){
                    latDiff = b[i][j]-b[i][j+1];
                    score-=latDiff;    
                }
            }
        }
    }
return score;
}
function simulateMove (dir, inputBoard) {
    let copy = inputBoard.map(row=>row.slice());
    switch(dir) {
        case ('left'): moveLeft(copy); break;
        case ('right'): moveRight(copy); break; 
        case ('up'): moveUp(copy); break; 
        case ('down'): moveDown(copy); break;
    } 
    return copy;
}
function chooseBestMove() {
//simulate moves in all directions 
//choose best move
let bestScore = -Infinity;
let bestMove = null;

//simulate moves and choose from the best move in two moves 
//copy of chooseBestMove()
// for (const dir of ['left','right','up','down']){
//     const newBoard = simulateMove(dir);
//     if (JSON.stringify(newBoard) === JSON.stringify(board)) continue;
//     const currentScore = scoreBoard(newBoard);
//     if (currentScore > bestScore) {
//         bestScore = currentScore;
//         bestMove = dir;
//     }
//     else if(currentScore === bestScore) {
//         const currentEmpty = countEmptyTiles(newBoard);
//         const bestEmpty = countEmptyTiles(simulateMove(bestMove));
//         if (currentEmpty > bestEmpty)
//         bestScore = currentScore;
//         bestMove = dir;
//     }
// }


//CURRENT TASK try to pick bestMove out of the 16 possible boards from the next two moves
for (const dir1 of ['left','right','up','down']){
    const newBoard = simulateMove(dir1, board);
    if (JSON.stringify(newBoard) === JSON.stringify(board)) continue;

    let secondBestScore = -Infinity;

        for(const dir2 of ['left','right','up','down']){
            const newerBoard = simulateMove(dir2, newBoard);
            if (JSON.stringify(newerBoard) === JSON.stringify(newBoard)) continue;

            const simScore = scoreBoard(newerBoard);
            if (simScore > secondBestScore) {
                secondBestScore = simScore;
            }
        }
        if (secondBestScore > bestScore) {
            bestScore = secondBestScore;
            bestMove = dir1;
        }
    }
return bestMove; 
}
function playBestMove(bestMove) {
    switch(bestMove) {
        case 'left':
            moveLeft(board);
            addRandomTile();
            renderBoard();
            break;
        case 'right':
            moveRight(board);
            addRandomTile();
            renderBoard();
            break;
        case 'up':
            moveUp(board);
            addRandomTile();
            renderBoard();
            break;
        case 'down':
            moveDown(board);
            addRandomTile();
            renderBoard();
            break;
    }

}
function countEmptyTiles(b) {
    let emptyCount = 0;
    for (let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if (b[i][j]===0){
                emptyCount++;
            }
        }
    }
return emptyCount;
}

initialize();
addRandomTile();
addRandomTile();
renderBoard();

document.addEventListener('keydown',(event) => {
    switch (event.key) {
    case 'ArrowLeft':
        moveLeft(board);
        addRandomTile();
        renderBoard();
        break;
    case 'ArrowRight':
        moveRight(board);
        addRandomTile();
        renderBoard();
        break;
    case 'ArrowUp':
        moveUp(board);
        addRandomTile();
        renderBoard();
        break;
    case 'ArrowDown':
        moveDown(board);
        addRandomTile();
        renderBoard();
        break;
    case ' ':
        const bestMove = chooseBestMove()
        if (bestMove) {
            playBestMove(bestMove);
        }
        else {
            alarm('no more moves')
        }
        renderBoard();
        break;
    }

    if (event.key === ' ' && event.ctrlKey === true) {
        if (!autoPlay) {
            autoPlay = true;
        intervalIndex = setInterval(() => {
            const bestMove = chooseBestMove()
            playBestMove(bestMove);
        }, 15);
        }
        else {
            clearInterval(intervalIndex);
        }
    }
})

