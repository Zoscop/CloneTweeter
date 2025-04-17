import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import FollowSystemActu from './FollowSystemActu'
import LikeButton from './LikeButton'

function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const ShowTweet = () => {
  const [tweets, setTweets] = useState<any[]>([])
  const currentUser = localStorage.getItem('username') || sessionStorage.getItem('username')  || ''

  const fetchTweets = async () => {
    try {
      const tweetRes = await axios.get("http://localhost:3000/tweets")
      const tweetsWithPics = await Promise.all(
        tweetRes.data.map(async (tweet: any) => {
          try {
            const userRes = await axios.get(`http://localhost:3000/users?username=${tweet.username}`)
            const profilePicture = userRes.data[0]?.profilePicture || ""
            return { ...tweet, profilePicture }
          } catch {
            return { ...tweet, profilePicture: "" }
          }
        })
      )

      const sorted = tweetsWithPics.sort(
        (a: any, b: any) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
      )

      setTweets(sorted)
    } catch (error) {
      console.error("Erreur lors de la récupération des tweets:", error)
    }
  }

  useEffect(() => {
    fetchTweets()
  }, [])

  return (
    <div className="tweet-list space-y-8 px-4 py-10">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="tweet bg-[#1a1a1a] p-5 rounded-xl shadow-lg hover:shadow-red-600/50 transition duration-300 ease-in-out border border-red-800/20">
          <div className="tweet-header flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to={`/profil/${tweet.username}`}>
                <img src={tweet.profilePicture} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-red-700 shadow-md hover:scale-105 transition"/>
              </Link>
              <span className="username text-lg font-semibold text-red-500 tracking-wide">@{tweet.username}</span>
            </div>
            <FollowSystemActu usernameToFollow={tweet.username} />
          </div>
          <p className="tweet-content text-gray-200 text-md">{tweet.content}</p>
          <p className="tweet-date text-red-400 text-sm mt-2">{formatDate(tweet.currentDate)}</p>
          <LikeButton id={tweet.id} username={currentUser}/>
        </div>
      ))}
    </div>
  )
  
}

export default ShowTweet
