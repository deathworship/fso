const Header = (props) => {
    return (
      <h2>{props.course.name}</h2>
    )
  }
  
  const Part = (props) => {
    return (
      <p>{props.part} {props.exercises}</p>
    )
  }
  
  const Content = (props) => {
    const { parts } = props.course
    return (
      <div>
        {parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} /> )}
      </div>
    )
  }
  
  const Total = (props) => {
    const { parts } = props.course
    const total = parts.reduce((s, p) => s + p.exercises, 0)
    return (
      <p><b>total of {total} exercises</b></p>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
  }

  export default Course