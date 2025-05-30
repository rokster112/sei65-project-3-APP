import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import placeholder from '../styles/images/No-image.png'
import { API_URL } from '../config'

import Loading from './Loading'

const TopicPage = () => {
  const [topic, setTopic] = useState([]) 
  const [errors, setErrors] = useState(false)
  const [resStatus, setResStatus] = useState(null)
  const [search, setSearch] = useState('')
  const [filteredTopics, setFilteredTopics] = useState([])

  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    if (Array.isArray(topic)) {
      const regexSearch = new RegExp(search, 'i')
      const filteredArray = topic.filter(topLine => regexSearch.test(topLine.topic))
      setFilteredTopics(filteredArray)
    } else {
      console.log('topic is not an array', topic)
    }
  }, [search, topic])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/topic`)
        console.log('API_URL:', await axios.get(`${API_URL}/topic`))
        setTopic(Array.isArray(data) ? data : []) 
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
    }
    getData()
  }, [resStatus])

  const likeTopic = async (Id, firstLike) => {
    try {
      console.log(localStorage.getItem('userName'))
      const body = { like: firstLike + 1 }
      const res = await axios.put(`${API_URL}/topic${Id}`, body)
      setResStatus(body)
      console.log(res.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const dislikeTopic = async (Id, firstLike) => {
    try {
      console.log(localStorage.getItem('userName'))
      const body = { dislike: firstLike + 1 }
      const res = await axios.put(`${API_URL}/topic${Id}`, body)
      setResStatus(body)
      console.log(res.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="view">
      <div className="topic-div">
        <div className="search-topics">
          <div>
            <input onChange={handleChange} className="mb-4" type="text" name="search" value={search} placeholder="Search topics"/>
          </div>
          <div>
            <h1 className="text-center">All Topics</h1>
          </div>
        </div>
      </div>
      <div className="topic-container">
        {filteredTopics.length > 0 
          ? filteredTopics.map(titles => {
            const { _id, topic, description, imageUrl, topicUser, createdAt, like, dislike } = titles
            const date = createdAt.split('T')[0]
            const time = createdAt.split('T')[1]
            const actualTime = time.split('.')[0]
            return (
              <div key={_id} className="topic">
                <div className="topic-text">
                  <Link to={`/topic/${_id}`}>
                    <div className="topic-date">{topicUser} Added on: {date} at: {actualTime}</div>
                    <div className="title">{topic}</div>
                    <div className="description">{description}</div>
                  </Link>
                  <div className="topic-like">
                    <button onClick={() => likeTopic(_id, like)}>👍 <span>{like}</span></button>
                    <button onClick={() => dislikeTopic(_id, dislike)}>👎 <span>{dislike}</span></button>
                  </div> 
                </div> 
                <div className="topic-image">
                  <img className="image" src={imageUrl ? imageUrl : placeholder} alt="Topic"/>
                </div>
              </div>
            )
          })
          : <>
            {errors ? <h2>Something went wrong. Please try again later</h2> : <Loading />}
          </>
        }
      </div>
    </div>
  )
}

export default TopicPage
