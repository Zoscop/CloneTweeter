import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import FollowSystemActu from './FollowSystemActu'

interface User {
  username: string
  profilePicture: string
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<any[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/users?username=${username}`)
        const tweetsResponse = await axios.get(`http://localhost:3000/tweets?username=${username}`)
        if (userResponse.data.length > 0) {
          setUser(userResponse.data[0])
        }
        setTweets(tweetsResponse.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", error)
      }
    }

    fetchUserData()
  }, [username])

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 p-6 text-white">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Profil de {username}</h1>
      <Link to="/TwitterPage">
        <button className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition mb-6 shadow-md shadow-red-900">Accès au Réseau Galactique</button>
      </Link>
      {user && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
          <div className="flex items-center mb-4">
            <img src={user.profilePicture} alt={user.username} className="w-24 h-24 rounded-full mr-4 border-4 border-red-600 shadow-xl"/>
            <div className="flex flex-col items-start">
              <p className="text-gray-200 text-lg font-semibold">{user.username}</p>
              <FollowSystemActu usernameToFollow={user.username} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-300 mt-6 mb-4">Communiqués de {user.username}</h2>
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <div key={tweet.id} className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
                <p className="text-gray-300">{tweet.content}</p>
                <small className="text-gray-500">Posté le : {tweet.currentDate ? new Date(tweet.currentDate).toLocaleString() : "Date inconnue"}</small>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Cet utilisateur n'a pas encore tweeté.</p>
          )}
        </div>
      )}
    </div>
  )
  
}

export default UserProfile
