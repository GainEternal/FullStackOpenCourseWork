import React from 'react'

const Course = ({ course }) => 
  {const total = course.parts.reduce((sum, next) => sum + next.exercises, 0)
    return <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total sum={total} />
      <br></br>
    </div>
  }

const Header = ({ courseName }) => <h2>{courseName}</h2>

const Total = ({ sum }) => <p><b>Total Number of Exercises: {sum} </b></p>

const Part = ({ part }) => 
  <p>
    {part.name}: {part.exercises}
  </p>

const Content = ({ parts }) =>
  parts.map(part => <Part key={part.id} part={part} />)

export default Course