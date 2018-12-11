import React, { Component } from 'react';
import Pizza from './components/Pizza'
import Notification from './components/Notification'
import pizzaService from './services/pizzat'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import pizzat from './services/pizzat';
import loginService from './services/login'
//import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {
      pizzat: [],
      newPizza: '',
      error: null,
      username: '',
      password: '',
      user: null
    }
  }

//tapahtumakäsittelijä
  addPizza = (event) => {
    event.preventDefault()
    const pizzaObject = {
      content: this.state.newPizza,
      date: new Date(),
    }
//luonti
    pizzaService
    .create(pizzaObject)
    .then(newPizza => {
      this.setState({
        pizzat: this.state.pizzat.concat(newPizza),
        newPizza: ''
      })
    })
}
//tapahtumakäsittelijä
toggleImportanceOf = (id) => {
  return () => {
    const pizza = this.state.pizzat.find(n => n.id === id)
    const changedPizza = { ...pizza}
//päivitys
    pizzaService
      .update(id, changedPizza)
      .then(changedPizza => {
        this.setState({
          pizzat: this.state.pizzat.map(pizza => pizza.id !== id ? pizza : changedPizza)
        })
      })
      //virheenkäsittelijä
      .catch(error => {
        this.setState({
          error: `pizza '${pizza.content}' on jo valitettavasti poistettu palvelimelta`,
          pizzat: this.state.pizzat.filter(n => n.id !== id)
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 50000)
      })
  }
}

//datan haku palvelimelta
componentWillMount() {
  pizzaService
    .getAll()
    .then(pizzat => {
      this.setState({ pizzat })
    })
}

//muutoksenkäsittelijä
handlePizzaChange = (event) => {
  this.setState({ newPizza: event.target.value })
}
//sisäänkirjautuminen
login = (event) => {
  event.preventDefault()
  console.log('Kirjautunut sisään tunnukselle', this.state.username, this.state.password)
}

//muutoksenkäsittelijä
handlePasswordChange = (event) => {
  this.setState({ password: event.target.value })
}
//muutoksenkäsittelijä
handleUsernameChange = (event) => {
  this.setState({ username: event.target.value })
}
//metodin toteutus
login = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username: this.state.username,
      password: this.state.password
    })

    this.setState({ username: '', password: '', user })
  } catch (exception) {
    this.setState({
      error: 'Kirjautuminen epäonnistui',
    })
    //Selaimen latauksen aikarajoitus
    setTimeout(() => {
      this.setState({ error: null })
    }, 5000)
  }
}

  render() {
    const pizzatToShow = this.state.pizzat 
    const CustomTableCell = withStyles(theme => ({
      head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);
    
    const styles = theme => ({
      root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
      },
      table: {
        minWidth: 700,
      },
      row: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
    });

    const loginForm = () => (
      <div>
        <h2>Kirjaudu</h2>

        <form onSubmit={this.login}>
          <div>
            Käyttäjätunnus:
            <input
              type="text"
              //name="username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </div>
          <div>
            Salasana:
            <input
              type="password"
              //name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <button>Kirjaudu sisään</button>
        </form>
      </div>
    )
    const pizzaForm = () => (
      <div>
        <h2>Luo uusi Pizza</h2>

        <form onSubmit={this.addPizza}>
          <input
            value={this.state.newPizza}
            onChange={this.handlePizzaChange}
          />
          <button>Tallenna</button>
        </form>
      </div>
    )

    
    return (
      <div>
        <h1>Pizzeria</h1>
        <Notification message={this.state.error} />
        {this.state.user === null ?
          loginForm() :
          <div>
            <p>Tervetuloa {this.state.user.name}</p>
            {pizzaForm()}
          </div>
        }

       <Paper>
         <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell>Pizzat</CustomTableCell>
            </TableRow>
          </TableHead>
          <ul>
            {pizzatToShow.map(pizza => <Pizza 
            key={pizza.id} 
            pizza={pizza} 
            toggleImportance={this.toggleImportanceOf(pizza.id)}/>)}
          </ul>
          </Table>
        </Paper>

        <form onSubmit={this.addPizza}>
          <input 
            value={this.state.newPizza} 
            onChange={this.handlePizzaChange}
          />
          <button type="submit">Tallenna</button>
        </form>
       
      </div>
      
     
    )
  }
}


export default App;
