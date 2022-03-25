/**Global variables */
var word = 0;
var defWord = 0; /**Copy of word as word later gets turned into an array */
var display = document.getElementById('gameBlock'); /**div element where most game content is drawn */
var body = document.getElementById('body')
var defs = []; 
var guessed = new Set(); 
var letter = []; 
var wordSet; 
var loss = 3; 
var gameOver = 0; /**Bool -> 1 when game ends (Workaround for inability to turn off eventlistener) */
var definition = 1;

/**
 * Show the dictionary definitions for the current word
 */
function showDef(){
    var defBlock = document.getElementById('defBlock');
    defBlock.innerHTML = '<h3>Definitions:</h3>';
    for (i=0; ((i< 2) && (defs[i])); i++){
        paragraph = document.createElement('p');
        defContent = document.createTextNode(i + 1 + '. ' + defs[i]);
        paragraph.appendChild(defContent);
        defBlock.appendChild(paragraph)
    }

}
/** Restart the game by reloading the page */
function restart(){
    location.reload()
}
/**Draw the Interface */
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
    let buttons = ['restartButton', 'hintButton'];
    let actions = ['restart()','showDef()'];

    for (i=0;i < buttons.length;i++){
        let button = document.createElement('button');
        button.setAttribute('onclick',actions[i]);
        button.setAttribute('id',buttons[i]);
        controlsBlock.appendChild(button);
    }
    body.appendChild(controlsBlock);
    mobileKeys();

}
/**Hande key presses*/
function onPress(event){
    if (!(gameOver)){
        /**Get exact key pressed from the event */
        guess = event.key;
        guess = guess.toUpperCase();
        crossOut = document.getElementById('let-'+guess)
        crossOut.style.backgroundColor = 'grey'
        /**Validate the key */
        if (validateLetter(guess,guessed)){
            guessed.add(guess);
            /**If the letter is in the word */
            if (wordSet.has(guess)){
                wordSet.delete(guess);
                /**Reveal all instances of the letter in the word */
                for (i=0; i < word.length; i++){
                    if (word[i] === guess){
                        let letterBlock = document.getElementById('let-'+i);
                        letterBlock.classList.replace('dontShowLetter','showLetter');
                    }
                }
                /**Game has been won */
                if (wordSet.size === 0){
                    /** Game Has Been Won */
                    endGame(1);
                    return;
                }
            } 
            /**Letter not in the word */
            else{
                let letterBlock = document.createElement('div');
                let imageBlock = document.getElementById('image');
                letterBlock.innerHTML = guess;
                loss +=1;
                imageBlock.setAttribute('src','images/black/'+loss+'.png');
                /**Game Lost */
                if (loss === 10){
                    endGame(0);
                    return;
                    
                }
            }
        } 
    }
}


/**
 * End game message, show definitions. reveal word if lost.
 * @param {number} cond 1 for win, 0 for loss
 */
function endGame(cond){
    document.removeEventListener('keypress',onPress);
    /**Game over true as removeEventListener doesn't work */
    gameOver = 1;
    let endMessage = document.createElement('div');
    endMessage.classList.add('bigBoldText');
    endMessage.classList.add('show','endMessage')
    /** Game Lost*/
    if (cond === 0){
        endMessage.innerHTML = 'You Lost :(';
        endMessage.style.color = 'red'
        for (i=0; i < word.length; i++){
            let letterBlock = document.getElementById('let-'+i);
            letterBlock.classList.replace('dontShowLetter','showEnd');
        }
    }  
    /** Game Won */
    else{
        endMessage.style.color = 'green'
        endMessage.innerHTML = 'You Won!';
    }
    showDef();
    letWrapper.classList.add('hide')
    display.insertBefore(endMessage,display.firstChild);
    endMessage.classList.replace('hide','show')
    display.classList.add('moveDivMid')
    defBlock.classList.add('moveDivDef')
}
/**
 * validate inputs to only accept A-Z and a-z letters
 * @param {*} string string to be eveluated
 * @param {*} guessed letters guessed so far
 * @returns bool 
 */
function validateLetter(string,guessed){
    var regExp = new RegExp('[A-Za-z]');
    if (regExp.test(string) && string.length === 1 && !(guessed.has(string))){
            return 1;
    } else return 0;
}

/**Get the word from an API and call the get defintion function */
function getWord(){
    /**AJAX request to API*/
    let request = new XMLHttpRequest();
    request.open('GET','https://random-word-api.herokuapp.com/word?number=1');
    request.send();
    /**Word Recieved. Set*/
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            word = this.responseText.slice(2,-2).toUpperCase();
            defWord = word;
            console.log(word)
            word = word.split('');
            wordSet = new Set(word);
            getDefinition();
        }
    }
}
/**Get the definition of the word and start the game
 * If no definition exists get another word
 */
function getDefinition(){
    /**AJAX request to API */
    let request = new XMLHttpRequest();
    request.open('GET','https://api.dictionaryapi.dev/api/v2/entries/en/'+defWord);
    request.send();
    /**Response recieved. Parse and analyse data. */
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            obj = JSON.parse(request.responseText);
            /**A definition (or more) has (have) been found */
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
                /**If the API sends back that the word has no definition */
                console.log(obj['title'])
                getWord();
            }
        }
    }
}
function handleMobileInput(let){
    buttonClicked = document.getElementById('let-'+let);
    onPress({key:let})
}
//Nake a keyboard for mobile
function mobileKeys(){
    r1 = ['Q','W','E','R','T','Y','U','I','O','P']
    r2 = ['A','S','D','F','G','H','J','K','L']
    r3 = ['Z','X','C','V','B','N','M']
    letWrapper = document.getElementById('mobile-input')
    letRow  = document.createElement('div')
    for(i=0;i<r1.length;i++){
        letterButton = document.createElement('button')
        letterButton.innerHTML= r1[i]
        letterButton.setAttribute('id','let-'+r1[i])
        letterButton.setAttribute('onclick',`handleMobileInput("${r1[i]}")`)
        letRow.appendChild(letterButton)
    }
    letWrapper.appendChild(letRow)
    letRow  = document.createElement('div')
    for(i=0;i<r2.length;i++){
        letterButton = document.createElement('button')
        letterButton.innerHTML= r2[i]
        letterButton.setAttribute('id','let-'+r2[i])
        letterButton.setAttribute('onclick',`handleMobileInput("${r2[i]}")`)
        letRow.appendChild(letterButton)
    }
    letWrapper.appendChild(letRow)
    letRow  = document.createElement('div')
    for(i=0;i<r3.length;i++){
        letterButton = document.createElement('button')
        letterButton.innerHTML= r3[i]
        letterButton.setAttribute('id','let-'+r3[i])
        letterButton.setAttribute('onclick',`handleMobileInput("${r3[i]}")`)
        letRow.appendChild(letterButton)
    }
    letWrapper.appendChild(letRow)
}
function play(){
    getWord();
}
play();