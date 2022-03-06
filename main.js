var word = 0;
var defWord = 0;
var display = document.getElementById('gameBlock');
var defs = [];
var guessed = new Set();
var letter = [];
var wordSet;
var loss = 3;
var gameOver = 0;
var definition = 1;

function showDef(){
    var defBlock = document.getElementById('defBlock');
    defBlock.innerHTML = '<h3>Definitions:</h3>';
    for (i=0; i<defs.length; i++){
        paragraph = document.createElement('p');
        defContent = document.createTextNode(i + 1 + '. ' + defs[i]);
        paragraph.appendChild(defContent);
        defBlock.appendChild(paragraph)
    }

}

function restart(){
    location.reload()
}

function setupBoard(){

    let wordBlock = document.createElement('div');
    wordBlock.setAttribute('id','wordBlock')
    for (i = 0; i < word.length; i++){
        let letterBlock = document.createElement('div');
        letterBlock.classList.add('letterBlock');
        letterBlock.classList.add('dontShowLetter');
        letterBlock.innerHTML= '<p>' + word[i] + '</p>'
        letterBlock.setAttribute('id','let-'+i);
        wordBlock.appendChild(letterBlock);
        
    }
    display.appendChild(wordBlock);
    let guessedBlock = document.createElement('div');
    guessedBlock.setAttribute('id','guessedBlock');
    display.appendChild(guessedBlock);
    let controlsBlock = document.createElement('div');
    controlsBlock.setAttribute('id','controlsBlock');
    let buttons = ['Restart', 'Hint'];
    let actions = ['restart()','showDef()'];

    for (i=0;i < buttons.length;i++){
        let button = document.createElement('button');
        button.setAttribute('onclick',actions[i]);
        button.innerHTML = buttons[i];
        controlsBlock.appendChild(button);
    }
    display.appendChild(controlsBlock);

}

function onPress(event){
    if (!(gameOver)){
        let guess = event.key;
        guess = guess.toUpperCase();
        console.log(guess);
        if (validateLetter(guess,guessed)){
            guessed.add(guess);
            if (wordSet.has(guess)){
                wordSet.delete(guess);
                for (i=0; i < word.length; i++){
                    if (word[i] === guess){
                        let letterBlock = document.getElementById('let-'+i);
                        letterBlock.classList.replace('dontShowLetter','show');
                    }
                }
                if (wordSet.size === 0){
                    /** Game Has Been Won */
                    console.log('You Won!!!');
                    endGame(1);
                    return;
                    
                    
                }
            } else{
                let letterBlock = document.createElement('div');
                let imageBlock = document.getElementById('image');
                letterBlock.innerHTML = guess;
                guessedBlock.appendChild(letterBlock);
                loss +=1;
                imageBlock.setAttribute('src','images/black/'+loss+'.png');
                if (loss === 10){
                    console.log('You Lost :(');
                    endGame(0);
                    return;
                    
                }
            }
        } else {
            /**
             * An Invalid Guess Is Provided
             */
        }
    }
}


/**
 * 
 * @param {*} cond 
 */
function endGame(cond){
    document.removeEventListener('keypress',onPress);
    gameOver = 1;
    let endMessage = document.createElement('div');
    endMessage.classList.add('bigBoldText');
    if (cond === 0){
        /** Game Lost*/
        endMessage.innerHTML = 'You Lost :(';
        for (i=0; i < word.length; i++){
            let letterBlock = document.getElementById('let-'+i);
            letterBlock.classList.replace('dontShowLetter','show');
        }
    } else{
        /** Game Won 
         * Show dictionary Definition once that's set up
        */
       endMessage.innerHTML = 'You Won!';
    }
    display.insertBefore(endMessage,display.firstChild);
}
/**
 * 
 * @param {*} guess 
 */
function validateLetter(string,guessed){
    var regExp = new RegExp('[A-Za-z]');
    if (regExp.test(string) && string.length === 1 && !(guessed.has(string))){
            return 1;
    } else return 0;
}


function getWord(){
    let request = new XMLHttpRequest();
    request.open('GET','https://random-word-api.herokuapp.com/word?number=1');
    request.send();
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            word = this.responseText.slice(2,-2).toUpperCase();
            defWord = word;
            console.log(word)
            word = word.split('');
            getDefinition();
            wordSet = new Set(word);
        }
    }
}

function getDefinition(){
    let request = new XMLHttpRequest();
    request.open('GET','https://api.dictionaryapi.dev/api/v2/entries/en/'+defWord);
    request.send();
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            obj = JSON.parse(request.responseText);
            console.log(obj);
            if (!(obj['title']) && (obj[0].word == defWord.toLowerCase())){
                meanings = obj[0].meanings
                for (i = 0; i < meanings.length; i++){
                    definitions = meanings[i].definitions
                    for (j=0; j < definitions.length; j++){
                        definition = definitions[j].definition;
                        console.log('Definition: '+ definition);
                        defs.push(definition);
                    }
                }
                setupBoard();
                document.addEventListener('keypress', onPress)
            }
            else{
                console.log(obj['title'])
                getWord();
            }
        }
    }
}
function play(){
    getWord();
}

play();

/** 
 * Add Divs for each letter ---
 * Finish Event listener => change list as keys pressed ---
 * Hide the letters (either with CSS or Javascript (Modify a list of dashes)) ---
 * Add Incorrect Letters Display ---
 * Win and Lose Conditions ---
 * Hints (Dictionary Defintion API. Filter words that don't have a dictionary definition.)
 * Restart Button (Clearing old game and getting new word)
 */
