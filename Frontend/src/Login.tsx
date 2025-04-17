import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import axios from 'axios'

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const userEmail = localStorage.getItem("email")
    const user = localStorage.getItem("username")
    if (accessToken && userEmail && user) {
      navigate("/TwitterPage")
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    try {
      const userResponse = await axios.get(`http://localhost:3000/users?username=${username}`)
      const user = userResponse.data[0]
  
      if (!user) {
        setError("Nom d'utilisateur incorrect.")
        return
      }
  
      const email = user.email
  
      const loginResponse = await axios.post('http://localhost:3000/login', {
        email,
        password
      })
  
      const accessToken = loginResponse.data.accessToken
  
      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("email", email)
        localStorage.setItem("username", username)
        localStorage.setItem("stayConnected", "true")
      } else {
        sessionStorage.setItem("accessToken", accessToken)
        sessionStorage.setItem("email", email)
        sessionStorage.setItem("username", username)
      }
  
      navigate("/TwitterPage")
      alert("Connexion Réussie")
    } catch (error) {
      setError("Identifiants incorrects, veuillez réessayer.")
      console.error(error)
    }
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-[url('https://cdn.pixabay.com/photo/2016/01/27/15/25/space-1164579_960_720.png')] bg-cover bg-center">
      <form onSubmit={handleLogin} className="bg-[#1a1a1a]/90 p-8 rounded-xl shadow-2xl backdrop-blur-md border border-gray-700 flex flex-col gap-5 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center text-red-600 tracking-wide">Connexion DeathStar</h2>
        <input type="text" placeholder="Identifiant impérial" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-3 bg-black border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"/>
        <input type="password" placeholder="Code d'accès secret" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-3 bg-black border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"/>
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-600"/>Rester connecté sur l’Étoile Noire
        </label>
        <button type="submit" className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition tracking-wider">Accéder au système</button>
        <Link to="/" className="text-center text-red-500 hover:underline">
          Pas encore recruté ? Rejoindre l’Empire
        </Link>
        {error && <p className="text-red-400 text-center">{error}</p>}
      </form>
    </div>
  )
  
}

export default Login

