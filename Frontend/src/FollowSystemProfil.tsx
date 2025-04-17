import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FollowSystemProfil: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [followColor, setFollowColor] = useState(false)

  useEffect(() => {
    const currentUserEmail = localStorage.getItem('email') || sessionStorage.getItem('email')

    // Charger tous les utilisateurs depuis le backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users')
        const allUsers = response.data
        const loggedInUser = allUsers.find((user: any) => user.email === currentUserEmail)
        setCurrentUser(loggedInUser)
        const filteredUsers = allUsers.filter((user: any) => user.email !== currentUserEmail)
        setUsers(filteredUsers)

      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs : ", error)
      }
    }

    fetchUsers()
  }, [])

  const handleFollowToggle = async (userEmail: string) => {
    if (!currentUser) return

    // Assurer que currentUser.follow est un tableau (même vide)
    const follows = Array.isArray(currentUser.follow) ? currentUser.follow : []
    const isFollowing = follows.includes(userEmail)
    const updatedFollows = isFollowing
      ? follows.filter(email => email !== userEmail)
      : [...follows, userEmail]

    try {
      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {follow: updatedFollows,})
      setCurrentUser({ ...currentUser, follow: updatedFollows })
      setFollowColor(!followColor)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du suivi :", error)
    }
  }

  if (!currentUser) {
    return <div>Chargement de l'utilisateur...</div>
  }

  if (users.length === 0) {
    return <div>Aucun utilisateur à afficher.</div>
  }

  return (
<div className="border-l border-gray-800 pl-4 max-w-sm bg-gray-950 p-4 rounded-xl shadow-xl text-white mx-auto">
  <h3 className="text-2xl font-bold text-red-600 mb-4">Agents à Recruter</h3>
  {users.length > 0 ? (
    users.map((user) => {
      const isFollowing = currentUser.follow && currentUser.follow.includes(user.email)
      return (
        <div key={user.id} className="flex justify-between items-center border-b border-gray-700 py-3">
          <span className="text-gray-200 font-medium">{user.username}</span>
          <button onClick={() => handleFollowToggle(user.email)} className={`px-3 py-1.5 border rounded-lg text-white font-semibold text-m tracking-wide transition-all duration-300 ease-in-out ml-2 ${
            isFollowing ? 'bg-[#8B0000] border-[#ff4d4d] hover:bg-[#a60000]' : 'bg-[#222831] border-[#00ADB5] hover:bg-[#393e46]'}`}
            onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isFollowing ? '#a60000' : '#393e46';
            }}
            onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isFollowing ? '#8B0000' : '#222831';
           }}
          >
            {isFollowing ? 'Révoquer' : 'Suivre'}
          </button>
        </div>
      )
    })
  ) : (
    <p className="text-gray-500 italic">Aucune cible disponible pour l'instant.</p>
  )}
</div>

  )
  

}

export default FollowSystemProfil
