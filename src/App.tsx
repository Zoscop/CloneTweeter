import React, { Fragment} from 'react'
import { BrowserRouter, Route, Routes} from 'react-router'
import Login from './Login'
import TwitterPage from './TwitterPage'
import SignIn from './SignIn'
import Profil from './Profil'
import UserProfile from './UserProfile'


function App() {

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/TwitterPage" element={<TwitterPage />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Profil" element={<Profil />}></Route>
          <Route path="/profil/:username" element={<UserProfile/>} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  )
}



export default App;