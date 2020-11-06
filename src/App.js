import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null, 
          title:'',
          completed:false,
        },
        editing:false,
      }
      this.fetchdata=this.fetchdata.bind(this)
      this.handlechange=this.handlechange.bind(this)
      this.handleSubmit=this.handleSubmit.bind(this)
      this.getCookie=this.getCookie.bind(this)
      this.deleteItem=this.deleteItem.bind(this)
      
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

componentDidMount(){
  this.fetchdata()
}

fetchdata(){
  fetch('https://restapifortodo.herokuapp.com/todo/dataapi')
 .then(response => response.json())
 .then(data => 
  
   this.setState({
     todoList:data
   })
   )
 }

 handlechange(e){
  var value=e.target.value
  var name=e.target.name
  this.setState({
    activeItem:{
    ...this.state.activeItem,
      title:value
    }
  })
 
}

handleSubmit(e){
  e.preventDefault()
var csrftoken=this.getCookie('csrftoken')
console.log('ITEM',this.state.activeItem)
var url='https://restapifortodo.herokuapp.com/todo/createtasks'

if(this.state.editing == true){
url = `https://restapifortodo.herokuapp.com/todo/updatetask/${ this.state.activeItem.id}/`
this.setState({
  editing:false
})
}


fetch(url,{
  method:'post',
  headers:{
    'content-type':'application/json',
    'X-CSRFToken':csrftoken,
  },
  body:JSON.stringify(this.state.activeItem)
}).then((response)=>{
  this.fetchdata()
  this.setState({
    activeItem:{
      id:null, 
      title:'',
      completed:false,  //doubt
    }
  })
}).catch((error)=>{
  console.log('ERROR',error)
})
}

  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  deleteItem(task){
 
    var csrftoken = this.getCookie('csrftoken')
  
    fetch(`https://restapifortodo.herokuapp.com/todo/deletetasks/${task.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{
  
      this.fetchdata()
    })
  }





  render(){
    var tasks = this.state.todoList
    var self = this
    return(
        <div className="container">

          <div id="task-container">
              <div  id="form-wrapper">
                 <form onSubmit={this.handleSubmit}  id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handlechange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                         </div>

                         <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
                </form>
             
              </div>

              <div  id="list-wrapper">         
                    {tasks.map(function(task, index){
                      return(
                          <div key={index} className="task-wrapper flex-wrapper">

                            <div style={{flex:7}}>
                            <span>{task.title}</span>
                               
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                            </div>

                          </div>
                        )
                    })}
              </div>
          </div>
          
        </div>
      )
  }
}



export default App;
