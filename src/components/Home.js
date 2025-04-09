import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import placeholder from '../styles/images/No-image.png'
import { API_URL } from '../config'

// Import Bootstrap Components
import Loading from './Loading'

const Home = () => {
  // const [ topics, setTopics ] = useState({
  //   'mostComments': {},
  //   'latestTopic': {},
  //   'mostLikes': {},
  // })

  const [topics, setTopics ] = useState([])
  const [ errors, setErrors ] = useState(false)

  // ! Executed
  useEffect(() => {
    const getData = async () => {
      try {

 
        const { data: latestTopic } = await axios.get(`${API_URL}/latest-topic`)
        const { data: mostComments } = await axios.get(`${API_URL}/highest-comment`)
        const { data: mostLikes } = await axios.get(`${API_URL}/most-likes`)
        setTopics([...topics, { ...latestTopic, title: 'Latest Topic' }, { ...mostComments, title: 'Most Comments' }, { ...mostLikes, title: 'Most Likes' }])
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

  console.log('new topic', topics)

  return (
    <>
      <div className="topic-div">
        <h1 className="text-center"> Welcome!</h1>
      </div>
      <div className="topic-container">
        <div>
          {Object.values(topics).length > 0 
            ? Object.values(topics).map((topic, index) => (
              <div key={index}>
                <div className="home-title">{topic.title}</div>
                <div key={topic._id} className="topic">
                  <div className="topic-text">
                    <Link to={`/topic/${topic._id}`}>
                      {/* Handle the case where createdAt is missing */}
                      <div className="topic-date">
                        {topic.topicUser} Added on: 
                        {topic.createdAt ? 
                          `${topic.createdAt.split('T')[0]} at ${topic.createdAt.split('T')[1].split('.')[0]}` 
                          : 'Date not available'}
                      </div>
                      <div className="title">{topic.topic}</div>
                      <div className="description">{topic.description}</div>
                    </Link>
                  </div>
                  <div className="topic-image">
                    <img className="image" src={topic.imageUrl ? topic.imageUrl : placeholder} alt="Topic"/>
                  </div>        
                </div>
              </div>
            ))
            :
            <>
              {errors ? <h2>Something went wrong. Please try again later</h2> : <Loading />}
              {console.log('errors', errors)}
            </>
          }
        </div>
      </div>
    </>
  )
  
}

export default Home