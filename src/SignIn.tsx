import axios from 'axios' 
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

function SignIn() {
    
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const success = await register(username, email, password)

        if (success){
            setUsername("")
            setEmail("")
            setPassword("")
            navigate("/TwitterPage")
            alert("Inscription Réussie")
        }
    }

    async function register(username: string, email: string, password: string) {
        try {
            const response = await axios.post('http://localhost:3000/register', {
                username,
                email,
                password
            })
            
            const accessToken = response.data.accessToken
            sessionStorage.setItem("accessToken", accessToken)
            sessionStorage.setItem("email", email)
            sessionStorage.setItem("username", username)
            return true
        } catch (error: any) {
            console.error(error)

            if (error.response && error.response.status === 400) {
                setError("Cet email ou nom d'utilisateur est déjà utilisé !")
            } else {
                setError("Une erreur est survenue !")
            }

            setUsername("")
            setEmail("")
            setPassword("")
            return false
        }
    }


    return (
      <div className="flex justify-center items-center min-h-screen bg-black bg-[url('https://cdn.pixabay.com/photo/2016/01/27/15/25/space-1164579_960_720.png')] bg-cover bg-center">
        <form onSubmit={handleSignIn} className="bg-[#1a1a1a]/90 p-8 rounded-xl shadow-2xl backdrop-blur-md border border-gray-700 flex flex-col gap-5 w-full max-w-md text-white">
          <h2 className="text-3xl font-bold text-center text-red-600 tracking-wide">Rejoignez DeathStar</h2>
          <input type="text" placeholder="Identifiant impérial" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-3 bg-black border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"/>
          <input type="email" placeholder="Holo-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-3 bg-black border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"/>
          <input type="password" placeholder="Code d'accès secret" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-3 bg-black border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"/>
          <button type="submit" className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition tracking-wider">Activer l’accès</button>

          <Link to="/Login" className="text-center text-red-500 hover:underline">
           Déjà dans l'Empire ? Se connecter
          </Link>

          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
      </div>
    )     
}

export default SignIn