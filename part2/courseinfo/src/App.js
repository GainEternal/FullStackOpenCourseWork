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
  parts.map(part => <Part part={part} />)

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
      <h1>Web Development Curriculum</h1>
      {courses.map(course => <Course course={course} />)}
    </>
  )
}

export default App