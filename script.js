const quotes = [
    'Look, we can discuss sexism in survival situations when I get back.',
    'Your scientists were so preoccupied with whether or not they could, they didnt stop to think if they should.',
    'I told you how many times we needed locking mechanisms on the vehicle doors.',
    'Hold on to your butts.',
    'Its a UNIX system! I know this!',
];

const quote = document.getElementById('quote');
const input = document.getElementById('typed-value');
const start = document.getElementById('start');
const message = document.getElementById('message');
const gamerName = document.getElementById("gamer-name");
const scores = getScores();
const scoresUnorderedList = document.getElementById("scores-unordered-list");

let wordQueue;
let highlightPosition;
let startTime;

start.addEventListener('click', startGame);
input.addEventListener('input', checkInput);

initializeGame();

function startGame(){
    console.log("Game started");
    const scoreItem = {
        name: gamerName.value,
        milliseconds: 0
    };

    scores.push(scoreItem);

    document.body.className = "";
    start.className = "started";
    
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = quotes[quoteIndex];
    
    // quoteText = "type me";
    wordQueue = removeSpecialChars(quoteText).split(' ');
    quote.innerHTML = wordQueue.map(word => (`<span>${word}</span>`)).join('');

    highlightPosition = 0;
    quote.childNodes[highlightPosition].className = 'highlight';

    startTime = new Date().getTime();

    document.body.className = "";
    start.className = "started";
    setTimeout(() => {start.className = "button";}, 2000);

}

function removeSpecialChars(str) {
    return str.replace(/(?!\w|\s)./g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

function checkInput() {
    console.log("Checking", input.value);
    const currentWord = wordQueue[0].replaceAll(".", "").replaceAll(",", "");
    const typedValue = input.value.trim();

    if(currentWord !== typedValue){
        input.className = currentWord.startsWith(typedValue) ? "" : "error";
        return;
    }

    wordQueue.shift(); //shift removes first item (0th element)
    input.value = ""; //empty textbox

    quote.childNodes[highlightPosition].className = ""; // unhighlight word

    if(wordQueue.length === 0){ // if we have run out of words then game over.
        gameOver();
        return;
    }
    highlightPosition++;
    quote.childNodes[highlightPosition].className = 'highlight';
}

function gameOver() {
    const elapsedTime = new Date().getTime() - startTime;
    document.body.className = "winner";
    message.innerHTML = `<span class="congrats">Congratulations!</span>
    <br>
    You finished in ${elapsedTime/1000} seconds`;

    const lastScoreItem = scores.pop();
    lastScoreItem.milliseconds = elapsedTime;
    scores.push(lastScoreItem);
    saveScores();
        //clear out old list
    while(scoresUnorderedList.firstChild){
        scoresUnorderedList.removeChild(scoresUnorderedList.firstChild);
    }
    //get from localStorage
    let scoreArr = getScores();
    //get current score
    let currentScore = scoreArr.pop();
    let topScore = getTopScore(scoreArr);
    //take out any scores that were 0
    scoreArr = scoreArr.filter(function( obj ) {
        return obj.milliseconds !== 0;
    });

    //add current score to li at top
    const liCurrentItem = createElementForScore(currentScore, "Your score: ");
    scoresUnorderedList.appendChild(liCurrentItem);

    //add fastest score to li's
    const liTopScore = createElementForScore(topScore, "Top score: ");
    scoresUnorderedList.appendChild(liTopScore);
}

function getTopScore(scoreArr) {
    //get fastest score
    let topScore = scoreArr.reduce(function(prev, current) {
        return (prev.milliseconds < current.milliseconds) ? prev : current
    }) // returns object
    console.log("topScore is", topScore);
    return topScore;
}

function getScores() {
    const noScoreFound = "[]";
    const scoresJSON = localStorage.getItem('scores') || noScoreFound;
    let scoreArr = JSON.parse(scoresJSON);
    //take out any scores that are 0
    scoreArr = scoreArr.filter(function( obj ) {
        return obj.milliseconds !== 0;
    });
    return scoreArr;
}

function saveScores() {
    const data = JSON.stringify(scores);
    localStorage.setItem('scores', data);
}

function createElementForScore(score, scoreMessage) {
    const template = document.getElementById("score-item-template");
    const newListItem = template.content.cloneNode(true);

    const text = newListItem.querySelector(".score-text");
    text.innerHTML = scoreMessage + " " + score.name + " in " + score.milliseconds/1000 + " seconds.";
    return newListItem;
}

function initializeGame() {
    quote.innerHTML = '';
    message.innerHTML = '';

    let topScore = getTopScore(scores);
    console.log("top score", topScore);
    const liTopScore = createElementForScore(topScore, "Top score: ");
    scoresUnorderedList.appendChild(liTopScore);
}

//moves cursor to text box after clicking start button
document.getElementById('start').onclick = function() {
    document.getElementById('typed-value').focus();
}