// CSS
import './App.css'

// React
import { useCallback, useState, useEffect } from 'react'

// Data
import { wordsList } from './data/words'

// Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  { id: 1, name: "Start" },
  { id: 2, name: "Game" },
  { id: 3, name: "End" },
]

const guessesQty = 5

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [pickedLetters, setPickedLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])

  // Start the Game
  const startGame = useCallback(() => {

    // clear all letters
    clearLetterStates()
    // pick word and pick category
    const { word, category } = pickWordAndCategory()

    // create an array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setPickedLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    // push guessed letter or remove a guess
    if(pickedLetters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended 
  useEffect(() => {
    if(guesses <= 0) {
      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses]) 

  // check win conditional 
  useEffect(() => {

    const uniqueLetters = [...new Set(pickedLetters)]

    // win condition
    if(guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word
      startGame()
    }

  }, [guessedLetters, pickedLetters, startGame])

  // restart the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === 'Start' && <StartScreen startGame={startGame} />}
      {gameStage === 'Game' &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          pickedLetters={pickedLetters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === 'End' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
