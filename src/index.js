import '../src/style.scss';

const speedDash = document.querySelector('.speedDash');
const scoreDash = document.querySelector('.scoreDash');
const lifeDash = document.querySelector('.lifeDash');
const container = document.getElementById('content');
const btnStart = document.querySelector('.btnStart');

btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', pressKeyOn);
document.addEventListener('keyup', pressKeyOff);

let animationGame = requestAnimationFrame(playGame);
let gamePlay = false;
let player = {
    speed: 1,
    lives: 3,
    gameScore: 0,
    carsToPass: 10,
    score: 0
};
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

function startGame() {
    container.innerHTML = '';
    btnStart.style.display = 'none';
    var div = document.createElement('div');
    div.setAttribute('class', 'playerCar');
    div.x = 250;
    div.y = 500;
    container.appendChild(div);
    gamePlay = true;
    animationGame = requestAnimationFrame(playGame);
    player = {
        ele: div,
        speed: 0,
        lives: 3,
        gameScore: 0,
        carsToPass: 1,
        score: 0,
        roadWidth: 250,
        gameEndCounter: 0
    };
    startBoard();
    setupOpponents(10);
}

function setupOpponents(num) {
    for (let x = 0; x < num; x++) {
        let temp = 'random' + (x + 1);
        let div = document.createElement('div');
        div.setAttribute('class', 'randomCar');
        div.setAttribute('id', temp);
        div.style.backgroundColor = randomColor();
        makeOpponent(div);
        container.appendChild(div);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(6);
        return ('0' + String(hex)).substr(-2);
    }
    return '#' + c() + c() + c();
}

function makeOpponent(e) {
    let tempRoad = document.querySelector('.road');
    e.style.left = tempRoad.offsetLeft + Math.ceil(Math.random() * tempRoad.offsetWidth) - 30 + 'px';
    e.style.top = Math.ceil(Math.random() * -400) + 'px';
    e.speed = Math.ceil(Math.random() * 17) + 2;
}

function startBoard() {
    for (let x = 0; x < 13; x++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'road');
        div.style.top = (x * 50) + 'px';
        div.style.width = player.roadWidth + 'px';
        container.appendChild(div);
    }
}

function pressKeyOn(event) {
    event.preventDefault();
    keys[event.key] = true
}

function pressKeyOff() {
    event.preventDefault();
    keys[event.key] = false
}

function updateDash() {
    scoreDash.innerHTML = player.score;
    lifeDash.innerHTML = player.lives;
    speedDash.innerHTML = Math.round(player.speed * 14);
}

function moveRoad() {
    let tempRoad = document.querySelectorAll('.road');
    let previousRoad = tempRoad[0].offsetLeft;
    let previousWidth = tempRoad[0].offsetWidth;
    let pSpeed = player.speed;
    for (let x = 0; x < tempRoad.length; x++) {
        let num = tempRoad[x].offsetTop + pSpeed;
        if (num > 600) {
            num = num - 650;
            let mover = tempRoad[x].offsetLeft + (Math.floor(Math.random() * 6) - 3);
            let roadWidth = (Math.floor(Math.random() * 11) - 5) + previousWidth;
            if (roadWidth < 200) {
                roadWidth = 200;
            }
            if (roadWidth > 400) {
                roadWidth = 400;
            }
            if (mover < 100) {
                mover = 100;
            }
            if (mover > 600) {
                mover = 600;
            }
            tempRoad[x].style.left = mover + 'px';
            tempRoad[x].style.width = roadWidth + 'px';
            previousRoad = tempRoad[x].offsetLeft;
            previousWidth = tempRoad[x].width;
        }
        tempRoad[x].style.top = num + 'px';
    }
    return {
        'width': previousWidth,
        'left': previousRoad
    }
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right)
    );
}

function moveOpponents() {
    let tempOpponent = document.querySelectorAll('.randomCar');
    for (let i = 0; i < tempOpponent.length; i++) {

        for(let ii = 0; ii < tempOpponent.length; ii++) {
            if(i != ii && isCollide(tempOpponent[i], tempOpponent[ii])) {
                tempOpponent[ii].style.top = (tempOpponent[ii].offsetTop + 50) + 'px';
                tempOpponent[ii].style.top = (tempOpponent[ii].offsetTop - 50) + 'px'
                tempOpponent[ii].style.left = (tempOpponent[ii].offsetLeft - 50) + 'px';
                tempOpponent[ii].style.left = (tempOpponent[ii].offsetLeft + 50) + 'px';
            }
        }

        let y = tempOpponent[i].offsetTop + player.speed - tempOpponent[i].speed;
        if (y > 2000 || y < -2000) {
            if(y > 2000) {
                player.score++;
                if(player.score > player.carsToPass) {
                    gameOverPlay();
                }
            }
            makeOpponent(tempOpponent[i])
        } else {
            tempOpponent[i].style.top = y + 'px';
            let hitCar = isCollide(tempOpponent[i], player.ele);
            if (hitCar) {
                player.speed = 0;
                player.lives--;
                if (player.lives < 1) {
                    player.gameEndCounter = 1;
                }
                makeOpponent(tempOpponent[i]);
            }
        }
    }
}

function gameOverPlay() {
    let div = document.createElement('div');
    div.setAttribute('class', 'road');
    div.style.top = '0px';
    div.style.width = '250px';
    div.style.backgroundColor = 'red';
    div.innerHTML = 'FINISH';
    div.style.fontSize = '3em';
    container.appendChild(div);
    player.gameEndCounter = 12;
    player.speed = 0;
}

function playGame() {
    if (gamePlay) {
        updateDash();

        let roadPara = moveRoad();
        moveOpponents();

        if (keys.ArrowUp) {
            if (player.ele.y > 400) {
                player.ele.y -= 1;
            }
            player.speed = player.speed < 20 ? (player.speed + 0.05) : 20;
        }
        if (keys.ArrowDown) {
            if (player.ele.y < 500) {
                player.ele.y += 1;
            }
            player.speed = player.speed > 0 ? (player.speed - 0.2) : 0;
        }
        if (keys.ArrowRight) {
            player.ele.x += (player.speed / 4);
        }
        if (keys.ArrowLeft) {
            player.ele.x -= (player.speed / 4);
        }

        if ((player.ele.x + 40) < roadPara.left || (player.ele.x > (roadPara.left + roadPara.width))) {
            if (player.ele.y < 500) {
                player.ele.y += 1;
            }
            player.speed = player.speed > 0 ? (player.speed - 0.2) : 5;
        }

        player.ele.style.top = player.ele.y + 'px';
        player.ele.style.left = player.ele.x + 'px';
    }
    animationGame = requestAnimationFrame(playGame);
    if (player.gameEndCounter > 0) {
        player.gameEndCounter--;
        player.y = (player.y > 60) ? player.y - 30 : 60;
        if (player.gameEndCounter == 0) {
            gamePlay = false;
            cancelAnimationFrame(animationGame);
            btnStart.style.display = 'block';
        }
    }
}