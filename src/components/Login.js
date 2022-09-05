import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'


const Login = () => {
  
  const [ loginData, setloginData ] = useState({
    userName: '',
    password: '',
  })
  
  const navigate = useNavigate()
  
  const [ errors, setErrors ] = useState(false)
  
  const handleChange = (e) => {
    setloginData({ ...loginData, [e.target.name]: e.target.value })
    setErrors(false)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const res = await axios.post(`${API_URL}/login`, loginData)
      const { token } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('userName', loginData.userName)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      navigate('/')
    } catch (error) {
      console.log(error)
      setErrors(error.response.data.message)
    }
  }
  
  
  return (
    <div className='login-body'>
      <div className='login-container'>
        <h1 className='login-title'>Login Form</h1>
        {errors && <div className='error'>{errors}</div>}
        <form onSubmit={onSubmit} className='login-form'>
          <input 
            type='text' name='userName' placeholder='Username' value={loginData.userName} onChange={handleChange}
          />
          <input type='password' name='password' placeholder='Password' value={loginData.password} onChange={handleChange}
          />
          <div className='login-button-container'>
            <button type='submit' className='login-button'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
  
}

export default Login