import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { lazy,Suspense } from 'react';
import {Home, Create, Comments, Posts, Follow, ProfileSingle} from './components/index';
import Login from './auth/Login';
// import Profile from './components/Profile';
import Signin from './auth/Signin';
import React from 'react';
const Profile = React.lazy(()=> import('./components/Feed'))
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/login' Component={Login} />
        <Route path='/feed' element={
          <React.Suspense fallback={<div>Loading....</div>}>
            <Profile/>
          </React.Suspense>
        } />
        <Route path='/profile/:id' Component={ProfileSingle} />
        <Route path='/signin' Component={Signin} />
        <Route path='/create' Component={Create} />
        <Route path='/comments/:id' Component={Comments} />
        {/* <Route path='/posts' Component={Posts}/> */}
        <Route path='follow' Component={Follow}/>
      </Routes>
    </Router>
  )
}

export default App
