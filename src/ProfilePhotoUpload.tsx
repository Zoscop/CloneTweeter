import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [preview, setPreview] = useState("")

  useEffect(() => {
    const currentEmail = localStorage.getItem("email") || sessionStorage.getItem("email")
    axios.get(`http://localhost:3000/users?email=${currentEmail}`)
      .then(res => {
        setUser(res.data[0])
        setImageUrl(res.data[0].profilePicture || "")
      })
  }, [])

  const handleUpdate = async () => {
    if (!user) return
    await axios.patch(`http://localhost:3000/users/${user.id}`, { profilePicture: imageUrl })
    alert("Photo mise à jour !")
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-950 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Mon Profil Impérial</h1>
      <div className="flex items-center gap-4 mb-6">
        <img src={preview || imageUrl || "https://via.placeholder.com/100"} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-red-600 shadow-lg"/>
        <input type="text" placeholder="URL de votre photo de profil" value={imageUrl} onChange={(e) => {setImageUrl(e.target.value),setPreview(e.target.value)}} className="p-3 border-2 border-gray-700 rounded-lg w-full bg-gray-800 text-white focus:ring-2 focus:ring-red-600"/>
      </div>
      <button onClick={handleUpdate} className="w-full max-w-xs p-3 rounded-lg transition duration-300 bg-gradient-to-r from-red-800 to-red-600 text-white font-bold tracking-wider hover:from-red-700 hover:to-red-500 shadow-md shadow-red-900 hover:shadow-lg">
        Mettre à jour l'Avatar Impérial
        </button>
    </div>
  )
  
}

export default ProfilePage
