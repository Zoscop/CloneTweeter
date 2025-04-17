import React, { useState } from 'react'
import axios from 'axios'

function TweetForm({ onTweetPosted }: { onTweetPosted: () => void }) {
    const [tweet, setTweet] = useState("")
    const [error, setError] = useState("")
  
    const handleTweetPost = async (e: React.FormEvent) => {
      e.preventDefault()
  
      if (tweet.trim() === "") {
        setError("Le tweet ne peut pas être vide.")
        return
      }
  
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
      const email = localStorage.getItem("email") || sessionStorage.getItem("email")
      const username = localStorage.getItem("username") || sessionStorage.getItem("username")
      const currentDate = new Date().toISOString()
  
      if (!accessToken || !email) {
        alert("L'utilisateur n'est pas connecté.")
        return
      }
  
      try {
        await axios.post("http://localhost:3000/tweets", {
          content: tweet,
          username,
          currentDate,
        })
        setTweet("")
        setError("")
        onTweetPosted()
      } catch (error) {
        console.error("Erreur lors de la publication du tweet:", error)
        setError("Une erreur est survenue. Veuillez réessayer.")
      }
    }
  
    return (
      <form onSubmit={handleTweetPost} className="mb-6">
        <textarea value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder="Transmettez votre rapport, agent impérial..." className="w-full p-4 bg-[#1f1f1f] text-gray-200 placeholder-gray-500 border border-red-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-600" rows={3}/>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button type="submit" className="bg-red-700 text-white px-4 py-2 mt-3 rounded hover:bg-red-800 transition shadow-md">Transmettre</button>
      </form>
    )
    
  }
  

export default TweetForm

