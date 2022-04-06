import React from 'react'
import Api, { check_auth } from '../Api'
import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            isLoading: false,
            errors: [],
            done: false,
        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
    }

    componentDidMount() {
        check_auth(
            () => {
                this.setState({done: true})
            },
            () => {}
        )
    }

    usernameChangeHandler(event) {
        this.setState({username: event.target.value})
    }

    passwordChangeHandler(event) {
        this.setState({password: event.target.value})
    }

    submitHandler(event) {
        event.preventDefault()

        this.setState({isLoading: true})

        var data = {}

        data['password'] = this.state.password

        // determine username is email or username
        if (this.state.username.includes('@')) {
            data['email'] = this.state.username
        } else {
            data['username'] = this.state.username
        }

        Api.post('account/get-token/', data).then(res => {
            if (res.status === 200) {
                this.setState({isLoading: false, errors: []})

                let token = res.data.token
                window.localStorage.setItem('token', token)

                this.setState({done: true})
            } else {
                this.setState({isLoading: false, errors: ['Unexpected error: ' + res.status]})
            }
        }).catch(error => {
            if (error.response === undefined) {
                this.setState({isLoading: false, errors: [String(error)]})
            } else {
                this.setState({isLoading: false, errors: ['Invalid username or password']})
            }
        })
    }

    render() {
        if (this.state.done) {
            this.props.parentHandler(true)
            return <Navigate to='/' />;
        }

        var errors = <span></span>
        if (this.state.errors.length > 0) {
            errors = <div>
                <br/>
                <div className='alert alert-danger'>
                    {
                        this.state.errors.map((item, i) => <div><span key={i}>{item}</span><br/></div>)
                    }
                </div>
            </div>
        }
        return <div className='container' style={{'textAlign': 'left'}}>
            <div className='col-md-4'>
                <div className='card-body border shadow rounded-3'>
                    <h3>Login</h3>
                    <br/>
                    <form className='form-group' onSubmit={this.submitHandler}>
                        <label className='form-label' htmlFor='email'>Username or Email:</label>
                        <input required maxLength='255' id='email' value={this.state.username} type='text' onChange={this.usernameChangeHandler} className='form-control' placeholder='Enter your username or your email' />
                        <br/>
                        <label className='form-label' htmlFor='pass'>Password:</label>
                        <input required value={this.state.password} id='pass' type='password' onChange={this.passwordChangeHandler} className='form-control' placeholder='Enter your password' />
                        <br />
                        <input type='submit' className='btn btn-success w-100' value={this.state.isLoading ? 'Login...' : 'Login'} />
                    </form>
                    <br/>
                    <br/>
                    <Link to="/register">Do not have an account?</Link>
                    <br/>
                    <Link to="/reset-password">Forgot password?</Link>
                    <br/>
                    {errors}
                </div>
            </div>
        </div>
    }
}
