Play the game here: http://kalebakeitshokile.co.uk/Projects/Hangman/
# HangmanGame
A simple browser Hangman game written in Javascript

### How it works
This is a simple hangman game with dictionary definitions available as hints.

### External Resources
##### Words:
Words are fetched from the following API: https://random-word-api.herokuapp.com/word?number=1

##### Definitions:
Once words are obtained, the following API is used for definitions: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
Where word is the random word from the words API, if no definition is found, a new word is fetched (until a word with at least one defintion is found).
