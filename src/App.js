import React from 'react'
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import IndexPage from './pages/Index'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import UserPage from './pages/User'
import UserCommentsPage from './pages/UserComments'
import MyVotesPage from './pages/MyVotes'
import SinglePollPage from './pages/SinglePoll'
import CreatePollPage from './pages/CreatePoll'
import ResetPasswordPage from './pages/ResetPassword'
import Api, { check_auth } from './Api'

import 'mdb-ui-kit/css/mdb.min.css';
import 'mdb-ui-kit/js/mdb.min.js';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isAuth: false, username: '', email: ''}

    this.setIsAuth = this.setIsAuth.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  setIsAuth(value) {
      if (value === true) {
        Api.get('account/whoami/').then(res => {
          if (res.status === 200) {
            this.setState({
              isAuth: true,
              userId: res.data.user.id,
              username: res.data.user.username,
              email: res.data.user.email
            })
          } else {
            window.localStorage.removeItem('token')
          }
        }).catch(error => {
          window.localStorage.removeItem('token')
        })
      } else {
        this.setState({isAuth: value})
      }
  }

  componentDidMount() {
    check_auth(
        () => {
            this.setIsAuth(true)
        },
        () => {}
    )
  }

  logoutHandler() {
    if (window.confirm('Are you sure you want logout?')) {
      window.localStorage.removeItem('token')
      this.setIsAuth(false)
    }
  }

  render() {
    let nav_links = null
    if (this.state.isAuth) {
      nav_links = <ul>
        <div>Welcome {this.state.username} ({this.state.email})</div>
        <li><Link to='/'>Home</Link></li>
	<li><Link to="/reset-password">Reset password</Link></li>
        <li><button onClick={this.logoutHandler} className='btn btn-danger'>Logout</button></li>
        <li><Link to={'/user/' + this.state.userId + '/' + this.state.username}><button className='btn btn-primary'>My Polls</button></Link></li>
        <li><Link to={'/create-poll'}><button className='btn btn-success'>New Poll</button></Link></li>
        <li><Link to={'/my-votes'}><button className='btn btn-warning'>My Votes</button></Link></li>
      </ul>
    } else {
      nav_links = <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/register'>Register</Link></li>
        <li><Link to='/login'>Login</Link></li>
      </ul>
    }

    return (
      <div className="App">
        <Router>
          <nav className='navbar navbar-light bg-white'>
            <div className='container'>
              <a className='navbar-brand'>Home</a>
            </div>
          </nav>
          <div className='py-4'>
            <Routes>
              <Route exact path='/' element={<IndexPage />} />
              <Route exact path='/register' element={<RegisterPage parentHandler={this.setIsAuth} />} />
              <Route exact path='/login' element={<LoginPage parentHandler={this.setIsAuth} />} />
              <Route exact path='/my-votes' element={<MyVotesPage />} />
              <Route exact path='/create-poll' element={<CreatePollPage />} />
              <Route path='/user/:id/:name' element={<UserPage />} />
              <Route path='/user-comments/:id/:name' element={<UserCommentsPage />} />
              <Route path='/poll/:id' element={<SinglePollPage />} />
              <Route path='/reset-password' element={<ResetPasswordPage />} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
