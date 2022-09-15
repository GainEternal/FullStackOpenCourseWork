const Course = ({ course }) => 
  <>
    <Header courseName={course.name} />
    <Content parts={course.parts} />
    
  </>
  //<Total sum={parts[0].exercises + parts[1].exercises + parts[2].exercises} />

const Header = ({ courseName }) => <h1>{courseName}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) =>
  parts.map(part => <Part part={part} />)

const App = () => {
  const course = {
    id: 1, 
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App