import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const CreateTopicPage = () => {
  const [resStatus, setResStatus] = useState('')
  const [loginError, setLoginError] = useState('')
  const [ errors, setErrors ] = useState('')
  const [ topicData, setTopicData ] = useState({
    topic: '',
    description: '',
    imageUrl: '',
  })
  
  const navigate = useNavigate()

  const checkLogin = (comm) => {
    if (!localStorage.getItem('token')) {
      setLoginError('noLogin')
      return false
    }
    const currentUserName = localStorage.getItem('userName')
    if (currentUserName !== comm.topicUser){
      setResStatus({ status: 'WrongToken' })
      return false
    }
    console.log(localStorage.getItem('userName'))
    return true
  }

  const handleChange = (e) => {
    setTopicData({ ...topicData, [e.target.name]: e.target.value })
    setErrors(false)
  }

  const createTopic = async (e) => {
    e.preventDefault()
    if (!checkLogin({ topicUser: localStorage.getItem('userName') })){
      return 
    }
    //the code below is to check if the url is the right format to be printed
    const body = { ...topicData, createdAt: Date.now() }
    if (body.imageUrl.match(/\.(jpeg|jpg|gif|png)$/) === null && body.imageUrl !== '')  { 
      setResStatus('wrong-url')
      return 
    }

    try {
      console.log(body)
      const res = await axios.post(`${API_URL}/topic`, body)
      setResStatus(res)
      navigate('/topic')
    } catch (error){
      console.log(error.response)
      setErrors(error.response.data.message)
    }
    setTopicData({
      topic: '',
      description: '',
      imageUrl: '' })
  }
  
  return (
    <div className='create-container'>
      <h1 className='create-title'>Create Topic</h1>
      <form onSubmit={createTopic} className='create-form'>
        <input className="topic-title" type='text' name='topic' placeholder='topic title' value={topicData.topic} onChange={handleChange}/>
        <textarea name='description' placeholder='description' id="message-box" value={topicData.description} onChange={handleChange}></textarea>
        <input className="topic-url" type='text' name='imageUrl' placeholder='image URL' value={topicData.imageUrl} onChange={handleChange}/>
        { resStatus === 'wrong-url' && <p className='text-danger'> ERROR:The url provided is not a supported format!</p>}
        <p> { errors } </p>
        {loginError === 'noLogin' && <p> Need to <Link to = '/login'>Login</Link></p>}
        <div className='create-button-container'>
          <button type='submit' className='create-button'>CREATE</button>
        </div>
      </form>
    </div>
    
  )
  
}

export default CreateTopicPage