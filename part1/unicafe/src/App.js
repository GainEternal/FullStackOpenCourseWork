import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
) 

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}:</td><td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = (good - bad)/all
  const posPerCent =  Number(good/all*100).toFixed(2).toString().concat('%')

  return (
    <>
    <h2>Statistics</h2>
      
      <table>
        <tbody>
          <StatisticLine text='Good' value={good} />
          <StatisticLine text='Neutral' value={neutral} />
          <StatisticLine text='Bad' value={bad} />
          <tr><td colSpan="2">-----------------------</td></tr>
          <StatisticLine text='All' value={all} />
          <StatisticLine text='Average' value={Number(average).toFixed(2)} />
          <StatisticLine text='Positive' value={posPerCent} />
        </tbody>
      </table>
    </>
  )
  }

const App = () => {
  //save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  

  return (
    <>
      <h1>Give Feedback!</h1>
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral"/>
      <Button handleClick={() => setBad(bad + 1)} text="Bad"/>

      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App;
