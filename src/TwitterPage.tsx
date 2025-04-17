import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TweetForm from './TweetForm'
import ShowTweet from './ShowTweet'
import { Link } from 'react-router'
import Logout from './Logout'

function TwitterPage() {
  const [tweets, setTweets] = useState<any[]>([])

  const fetchTweets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tweets")
      const sorted = response.data.sort((a: any, b: any) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime())
      setTweets(sorted)
    } catch (err) {
      console.error("Erreur de chargement des tweets:", err)
    }
  }

  useEffect(() => {
    fetchTweets()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white bg-[url('https://preview.redd.it/ptyvlilmng741.png?auto=webp&s=55e631fba13bb4a223ce5446e3ece3aa5c2d8b7a')] bg-cover bg-center">
      <div className="max-w-2xl mx-auto py-10 px-4 bg-[#1a1a1a]/80 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <Link to="/Profil">
            <button className="w-full max-w-xs p-3 rounded-lg transition duration-300 bg-gradient-to-r from-red-800 to-red-600 text-white font-bold tracking-wider hover:from-red-700 hover:to-red-500 shadow-md shadow-red-900 hover:shadow-lg mt-7">Accès Profil</button>
          </Link>
          <Logout />
        </div>
        <h1 className="text-4xl font-bold text-center text-red-600 mb-6 tracking-wide">Centre de Commandement - DeathStar</h1>
        <TweetForm onTweetPosted={fetchTweets} />
        <div className="mt-10">
          <ShowTweet />
        </div>
      </div>
    </div>
  )
  
}

export default TwitterPage

