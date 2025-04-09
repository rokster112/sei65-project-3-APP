import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import placeholder from '../styles/images/No-image.png'
import { API_URL } from '../config'

// Import Bootstrap Components
import Loading from './Loading'

const Home = () => {

  const [topics, setTopics ] = useState([])
  const [ errors, setErrors ] = useState(false)

  // ! Executed
  useEffect(() => {
    const getData = async () => {
      try {

 
        const { data: latestTopic } = await axios.get(`${API_URL}/latest-topic`)
        const { data: mostComments } = await axios.get(`${API_URL}/highest-comment`)
        const { data: mostLikes } = await axios.get(`${API_URL}/most-likes`)
        setTopics([{ ...latestTopic, title: 'Latest Topic' }, { ...mostComments, title: 'Most Comments' }, { ...mostLikes, title: 'Most Likes' }])
      } catch (errors) {
        console.log(errors)
        setErrors(true)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    console.log('topics', topics)
  }, [topics])

  const trendingTopics = topics.map((topic, index) => {
    let count = 0
    if (count <= topics.length - 1) {
      return (
        <>
          <p style={{ textAlign: 'center' }}>{topic.title}</p>
          <div key={index}>
            <div className="home-title">{topic[count].title}</div>
            <div key={topic[count]._id} className="topic">
              <div className="topic-text">
                <Link to={`/topic/${topic[count]._id}`}>
                  <div className="topic-date">
                    {topic[count].topicUser} Added on: 
                    {topic[count].createdAt.split('T')[0]} at {topic[count].createdAt.split('T')[1].split('.')[0]} 
                  </div>
                  <div className="title">{topic[count].topic}</div>
                  <div className="description">{topic[count].description}</div>
                </Link>
              </div>
              <div className="topic-image">
                <img className="image" src={topic[count].imageUrl ? topic[count].imageUrl : placeholder} alt="Topic"/>
              </div>   
            </div>
          </div>
        </>)
    }
    count ++
    
  })


  return (
    <>
      <div className="topic-div">
        <h1 className="text-center"> Welcome!</h1>
      </div>
      <div className="topic-container">
        <div>
          {topics.length > 0 ? 
            trendingTopics
            : <Loading />}
        </div>
      </div>
    </>
  )
  
}

export default Home