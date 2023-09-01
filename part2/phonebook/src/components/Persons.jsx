const Persons = ({persons, onDeleteEntry}) => {
    return (
      <div>
        {persons.map(person => 
          <Person key={person.id} person={person} onDeleteEntry={() => onDeleteEntry(person.id)} />
        )}
      </div>
    )
  }
  
  const Person = ({person, onDeleteEntry}) => {
    return (
      <div>{person.name} {person.number} <button onClick={onDeleteEntry}>delete</button></div>
    )
  }

  export default Persons