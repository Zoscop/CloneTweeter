import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FollowSystemActu: React.FC<{ usernameToFollow: string }> = ({ usernameToFollow }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [followedUserEmail, setFollowedUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const currentUsername = localStorage.getItem('username') || sessionStorage.getItem('username')
    if (!currentUsername) {
      console.error("No current user username found!")
      return
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users?username=${currentUsername}`)
        const userData = response.data[0]
        if (userData) {
          setCurrentUser(userData)
        } else {
          console.error("User not found for username:", currentUsername)
        }

        const currentUserFollow = userData?.follow ?? []
        const userIsFollowing = currentUserFollow.includes(followedUserEmail ?? '')
        setIsFollowing(userIsFollowing)
      } catch (error) {
        console.error("❌ Erreur lors du chargement de l'utilisateur :", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchFollowedUserEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users?username=${usernameToFollow}`)
        const userData = response.data[0]
        setFollowedUserEmail(userData?.email ?? null)
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'email de l'utilisateur :", error)
      }
    }

    if (currentUsername && usernameToFollow) {
      fetchFollowedUserEmail()
      fetchCurrentUser()
    }
  }, [usernameToFollow])

  useEffect(() => {
    if (currentUser && followedUserEmail) {
      const currentUserFollow = currentUser?.follow ?? []
      const userIsFollowing = currentUserFollow.includes(followedUserEmail)
      setIsFollowing(userIsFollowing)
    }
  }, [currentUser, followedUserEmail])

  const handleFollowToggle = async () => {
    if (!currentUser || !followedUserEmail) return

    const updatedFollows = isFollowing
      ? currentUser.follow.filter((email: string) => email !== followedUserEmail)
      : [...(currentUser.follow ?? []), followedUserEmail]

    try {
      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, { follow: updatedFollows })
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du suivi :", error)
    }
  }


  if (!currentUser || currentUser.username === usernameToFollow) {
    return null
  }

  if (loading) {
    return <div>Chargement...</div>
  }


  return (
    <button onClick={handleFollowToggle} className={`px-3 py-1.5 border rounded-lg text-white font-semibold text-m tracking-wide transition-all duration-300 ease-in-out ml-2 cursor-pointer ${
      isFollowing ? 'bg-[#8B0000] border-[#ff4d4d] hover:bg-[#a60000]' : 'bg-[#222831] border-[#00ADB5] hover:bg-[#393e46]'}`}
    >
      {isFollowing ? 'Révoquer' : 'Suivre'}
    </button>

  )
}

export default FollowSystemActu
