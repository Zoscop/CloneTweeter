import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Logout from './Logout'
import { Link } from 'react-router'
import FollowSystemProfil from './FollowSystemProfil'
import  EditTweet  from "./EditTweet"
import ProfilePage from './ProfilePhotoUpload'

interface Tweet {
    id: number
    content: string
    currentDate?: string
    username : string
  }

function Profil() {
  const storage = localStorage.getItem("stayConnected") === "true" ? localStorage : sessionStorage
  const [username, setUsername] = useState("")
  const [tweets, setTweets] = useState<Tweet[]>([])

  const user = storage.getItem("username")

  // Charger les informations de l'utilisateur
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const usersResponse = await axios.get(`http://localhost:3000/users?username=${user}`)
        if (usersResponse.data.length > 0) {
          setUsername(usersResponse.data[0].username)
        }

        const tweetsResponse = await axios.get(`http://localhost:3000/tweets?username=${user}`)
        const sortedTweets = tweetsResponse.data.sort(
          (a: any, b: any) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
        )
        setTweets(sortedTweets)
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error)
      }
    }

    fetchUserInfo()
  }, [user])

  const handleDeleteTweet = (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) return

    fetch(`http://localhost:3000/tweets/${id}`, {
      method: "DELETE",

    })
      .then(() => {
        setTweets((prev) => prev.filter((t) => t.id !== id))
      })
      .catch((err) => console.error("Erreur suppression tweet:", err))
  }

  const handleEdit = async (tweetId: number) => {
    const newContent = prompt("Modifier le tweet :")
    if (newContent) {
      await EditTweet(tweetId, newContent)
    }
  }
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 bg-[url('https://preview.redd.it/ptyvlilmng741.png?auto=webp&s=55e631fba13bb4a223ce5446e3ece3aa5c2d8b7a')] bg-cover bg-center">
      <h1 className="text-4xl font-bold text-red-600 mb-6 drop-shadow-lg">Profil Impérial</h1>
      <Link to="/TwitterPage">
        <button className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition mb-6 shadow-md shadow-red-900">Accès au Réseau Galactique</button>
      </Link>
      <div className="bg-gray-950 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
        <p className="text-gray-300 mb-4">
          <strong className="text-red-500">Nom de l'Agent :</strong> {username}
        </p>
        <ProfilePage />
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-red-500">Communiqués Officiels</h2>
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4 hover:shadow-lg transition">
              <p className="text-gray-200">{tweet.content}</p>
              <small className="text-gray-500">Transmis le :{" "} {tweet.currentDate ? new Date(tweet.currentDate).toLocaleString() : "Date inconnue"}</small>
              <div className="flex justify-end mt-2 space-x-2">
                <button onClick={() => handleEdit(tweet.id)} className="bg-red-700 text-white px-3 py-2 rounded-lg hover:bg-red-800 transition">Modifier</button>
                <button onClick={() => handleDeleteTweet(tweet.id)} className="bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition">Supprimer</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune transmission trouvée.</p>
        )}
      </div>
      <div className="mt-6 w-full max-w-lg flex justify-center">
        <Logout />
      </div>
      <div className="mt-6 w-full max-w-lg">
        <FollowSystemProfil />
      </div>
    </div>
  )
  

}

export default Profil
