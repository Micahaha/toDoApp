import React from 'react'
import './App.css'
import { Dexie } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'


const db = new Dexie('todoApp')

db.version(1).stores({
  todos: '++id, title, completed, date'
})

const { todos } = db


const App = () => {
  
  const allItems = useLiveQuery(() => todos.toArray(), [])
  const completedItems = useLiveQuery(() => todos.where('completed').equals(1).toArray(), [])
  const latestItem = useLiveQuery(() => todos.orderBy('id').last(), [])
  todos.where('completed').equals(1).toArray()

  const addTask = async(event) => {
    event.preventDefault()
    const taskField = document.querySelector('#taskInput')

    await todos.add({
      task: taskField['value'],
      completed: 0,
    })



    taskField['value'] = ''

    console.log('====>', taskField.value)

  }

  const deleteTask = async (id) => todos.delete(id)
  const toggleStatus = async(id, event) => {
    const newCompleted = event.target.checked ? 1 : 0 // Toggle between 1 and 0
    await todos.update(id, { completed: newCompleted })  }



  console.log('====> ', allItems)
  console.log('====> ', allItems?.length)
  console.log('====> ', completedItems);
  console.log('====> ', latestItem);
  console.log('====>', latestItem?.task)


  return (    
    <div className="container">
      <h3 className="teal-text center-align">Todo App</h3>
      <form className="add-item-form" onSubmit={addTask}>
        <input
          type="text"
          id="taskInput"
          className="itemField"
          placeholder="What do you want to do today?"
          required
        />
        <button type="submit" className="waves-effect btn teal right">
          Add
        </button>
      </form>

      <div className="card white darken-1">
        <div className="card-content">
          {allItems?.map(({ id, completed, task }) => (
            <div className="row" key={id}>
            <p className="col s10">
              <label>
                <input
                type="checkbox" 
                checked={completed}  
                className="checkbox-blue"
                onChange={(event) => toggleStatus(id, event)}
                 />
                <span className={`black-tex ${completed && 'strike-text'}`}>{task}</span>
              </label>
            </p>
            <i 
            onClick={() => deleteTask(id)} 
            className="col s2 material-icons delete-button">
            delete
            </i>
          </div>
          ))}
        </div>
      </div>
        <div className=".container-css-grid">
        <div className="left-section">
          <h2>Task Tracker</h2>
          <p>Way to go!</p>
        </div>
        <div className="right-section">
          <div className="circle">
            <span>{completedItems?.length}/{allItems?.length}</span>
          </div>
        </div>
        <div className="footer">
          <p>‘ToDo {latestItem?.task} successfully added. Got id {latestItem?.id}’;</p>
        </div>
      </div>
    </div>
  )
}

export default App
