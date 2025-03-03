import React from 'react'
import './App.css'
import { Dexie } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'


const db = new Dexie('todoApp')

db.version(1).stores({
  todos: '++id, task, completed, date, listId',
  todoLists: '++id, title, date'

})

const { todos, todoLists } = db


const App = () => {
  
  const allItems = useLiveQuery(() => todos.toArray(), [])
  const lists = useLiveQuery(() => todoLists.toArray(), [])
  
  
  const completedItems = useLiveQuery(() => todos.where('completed').equals(1).toArray(), [])
  const latestItem = useLiveQuery(() => todos.orderBy('id').last(), [])
  todos.where('completed').equals(1).toArray()

  const relatedTodos = lists?.reduce((acc, list) => {
    acc[list.id] = allItems?.filter(todo => todo.listId === list.id) || [];
    return acc;
  }, {});
  

  const addTask = async(event) => {
    event.preventDefault()
    const taskField = document.querySelector('#taskInput')
    const taskValue = taskField.value // Get the value before clearing the input field
    taskField.value = ''

    await todos.add({
      task: taskValue,
      completed: 0,
    })
    console.log('====>', taskField.value)
  }
  
  const addTaskToList = async (event, listId) => {
    event.preventDefault();
    const taskField = document.querySelector(`#listInput-${listId}`);
    if (!taskField) {
      console.error(`Input field #listInput-${listId} not found!`);
      return; // Stop execution if input is missing
  }

    const taskValue = taskField.value;
    taskField.value = '';
  
    await todos.add({
      task: taskValue,
      completed: 0,
      listId // Associate todo with correct list
    });
  
    console.log('New task added to list:', listId);
  };
  

    const addList = async(event) => {
      event.preventDefault()
      const listInput = document.querySelector('#listNameInput')
      const listValue = listInput.value
      listInput.value = ''

      await todoLists.add({
        title: listValue
        
      })
      console.log('=R==>', listInput.value)
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
  console.log('====>', lists)


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


      
      <div className="todo-container">
       {lists?.map(({ id, title }, index) => {
        const todosForList = Array.isArray(relatedTodos[id]) ? relatedTodos[id] : [];
        return (
        <div key={id}>
          {/* Header */}
          <div className="todo-header">
            <h2>{title}</h2>
          </div>

          {/* Todo Items */}
          
          <div className="todo-list">
          {todosForList.map(({ id: todoId, task, completed }) => (

            <div key={todoId} className="todo-item">
              <input type="checkbox" className="todo-checkbox" />
              <span className={`black-tex ${completed && 'strike-text'}`}>{task}</span>
              <i onClick={() => deleteTask(todoId)} className="col s2 material-icons delete-button">delete</i>            
          </div>
          ))}



            {/* Input for new todo */}
            <div className="todo-input">
            <form className='add-item-form' onSubmit={event => addTaskToList(event, id)}> 
              <input type="checkbox" disabled className="todo-checkbox" />
              <input type="text" id={`listInput-${id}`} placeholder="Add todo item..." className="todo-textbox" />
              <button type="submit" className="-add-btn">+</button>
            </form> 
            </div>
          </div>
        </div>
        )})}
    </div>
    
    {/* Name List */}
    <form className="todo-name" onSubmit={addList}>
        <label>Give your list a name:</label>
        <input type="text" placeholder="Name of list..." className="todo-name-input" id='listNameInput' /> 
        <button type='submit' className='addList-btn'>Add new list</button>
      </form>
</div>
  )
}

export default App
