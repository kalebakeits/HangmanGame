var word = 0;
var display = document.getElementById('gameBlock');
var guessed = new Set();
var letter = [];
var wordSet;
var loss = 0;
var gameOver = 0;

function setupBoard(){

    let wordBlock = document.createElement('div');
    wordBlock.setAttribute('id','wordBlock')
    for (i = 0; i < word.length; i++){
        let letterBlock = document.createElement('div');
        letterBlock.classList.add('letterBlock');
        letterBlock.classList.add('dontShowLetter');
        letterBlock.innerHTML= word[i]
        letterBlock.setAttribute('id','let-'+i);
        wordBlock.appendChild(letterBlock);
        
    }
    display.appendChild(wordBlock);
    guessedBlock = document.createElement('div');
    guessedBlock.setAttribute('id','guessedBlock');
    display.appendChild(guessedBlock);
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
                letterBlock.innerHTML = guess;
                guessedBlock.appendChild(letterBlock);
                loss +=1;
                if (loss === 6){
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

function startGame(request){
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            word = this.responseText.slice(2,-2).toUpperCase();
            console.log(word)
            word = word.split('');
            wordSet = new Set(word)
            setupBoard();
            document.addEventListener('keypress', onPress)
        }
    }

}

function getWord(){
    let request = new XMLHttpRequest();
    request.open('GET','https://random-word-api.herokuapp.com/word?number=1');
    request.send();
    return request;
}
function play(){
    var request = getWord();
    /**
     * Code to validate word goes here
     */
    startGame(request);
}

play();

/** 
 * Add Divs for each letter
 * Finish Event listener => change list as keys pressed
 * Hide the letters (either with CSS or Javascript (Modify a list of dashes))
 * Add Incorrect Letters Display
 * Win and Lose Conditions
 * Hints (Dictionary Defintion API. Filter words that don't have a dictionary definition.)
 * Restart Button (Clearing old game and getting new word)
 */
