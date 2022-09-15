import { useState } from 'react'

const Anecdote = ({text, votes}) => (
  <>
    {text}<br/>
    ----------------------------------<br/>
    This anecdote has {votes} votes!
  </>
)

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>
        {props.text}
        </button>
    </>
  )
}

const App = () => {

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const handleVoteClicks = () => {
    const cpVotes = [...votes]
    cpVotes[selected] += 1
    setVotes(cpVotes)
  }

  const getIdxOfMax = (arr) => {
    return arr.indexOf(Math.max(...arr))
  }

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  return (
    <>
      <h1>Anecdote of the Day</h1>
      <p>
        <Anecdote 
          text={anecdotes[selected]} 
          votes={votes[selected]} 
        />
      </p>
      <p>
        <Button handleClick={() => handleVoteClicks()} text="Vote" />
        <Button handleClick={() => setSelected(getRandomInt(0,anecdotes.length))} text="Next Anecdote" />
      </p>
      <h1>Anecdote with Most Votes</h1>
        <Anecdote 
          text={anecdotes[getIdxOfMax(votes)]} 
          votes={Math.max(...votes)} 
        />

    </>
  )
}

export default App
