const colors = ['green', 'red', 'yellow', 'blue'];
let mix = [];
let person = [];
let level = 0;
let score = 0;
let highScore = 0;
let Started = false;
let between; // Renamed from 'gameInterval'

function start() {
    if (!Started) {
        Started = true;
        document.getElementById('circle').style.backgroundColor = "green";
        setTimeout(play, 3000); 
    }
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function play() {
    const newColor = getRandomColor();
    mix.push(newColor);
    person = [];
    level++;
    document.getElementById('score').innerText = score;
    document.getElementById('highScore').innerText = highScore;

    let i = 0;
    between = setInterval(() => { 
        if (i < level) {
          
            i++;
        } else {
            flash(newColor);
            clearInterval(between);
            enableButtons(); 
        }
    }, 1000);
}

function enableButtons() {
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', function() {
            youClick(button.id);
        });
    });
}

function youClick(color) {
    if (Started) {
        person.push(color);

        // Check if the current input matches the entire sequence
        if (!arraysEqual(person, mix)) {
            endGame();
        } else if (person.length === mix.length) {
            score++;
            if (score > highScore) {
                highScore = score;
            }
            play(); 
        }
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function flash(color) {
    document.getElementById(color).style.opacity = '0.5';
    setTimeout(() => {
        document.getElementById(color).style.opacity = '1';
    }, 500);
}

function endGame() {
    Started = false;
    document.getElementById('circle').style.backgroundColor = 'red';
    score = 0;
    level = 0;
    mix = [];
    clearInterval(between); 
    flash('green');
    flash('red');
    flash('yellow');
    flash('blue');
}