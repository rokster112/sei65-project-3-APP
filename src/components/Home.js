import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import placeholder from '../styles/images/No-image.png'
import { API_URL } from '../config'

// Import Bootstrap Components
import Loading from './Loading'

const Home = () => {
  const [topics, setTopics] = useState([])
  const [errors, setErrors] = useState(false)


  useEffect(() => {
    const getData = async () => {
      try {
        const [latestRes, commentsRes, likesRes] = await Promise.all([
          axios.get(`${API_URL}/latest-topic`),
          axios.get(`${API_URL}/highest-comment`),
          axios.get(`${API_URL}/most-likes`)
        ])

        const featuredTopics = [
          { ...latestRes.data, _metaTitle: 'Latest Topic' },
          { ...commentsRes.data, _metaTitle: 'Most Comments' },
          { ...likesRes.data, _metaTitle: 'Most Likes' }
        ]

        setTopics(featuredTopics)
      } catch (error) {
        console.error('Error fetching featured topics:', error)
        setErrors(true)
      }
    }

    getData()
  }, [])

  return (
    <>
      <div className="topic-div">
        <h1 className="text-center">Welcome!</h1>
        <p className="text-center">Check out our featured topics below</p>
      </div>

      <div className="topic-container">
        {topics.length > 0 ? (
          topics.map((topic, index) => (
            <div key={index} className="topic-block">
              <div className="home-title">{topic._metaTitle}</div>
              <div className="topic">
                <div className="topic-text">
                  <Link to={`/topic/${topic._id}`}>
                    <div className="topic-date">
                      {topic.topicUser} Added on:{' '}
                      {topic.createdAt
                        ? `${topic.createdAt.split('T')[0]} at ${topic.createdAt
                          .split('T')[1]
                          .split('.')[0]}`
                        : 'Date not available'}
                    </div>
                    <div className="title">{topic.topic}</div>
                    <div className="description">{topic.description}</div>
                  </Link>
                </div>
                <div className="topic-image">
                  <img
                    className="image"
                    src={topic.imageUrl || placeholder}
                    alt="Topic"
                  />
                </div>
              </div>
            </div>
          ))
        ) : errors ? (
          <h2 className="text-center">Something went wrong. Please try again later.</h2>
        ) : (
          <Loading />
        )}
      </div>
    </>
  )
}

export default Home
