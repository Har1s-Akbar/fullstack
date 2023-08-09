import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { lazy,Suspense } from 'react';
import {Home, Create, Comments, ProfileSingle, Nav} from './components/index';
import Login from './auth/Login';
import PrivateRoutes from './utils/PrivateRoutes';
// import Profile from './components/Profile';
import Signin from './auth/Signin';
import React from 'react';
import Loading from './components/Loading';
import Profileform from './components/Profileform';
const Profile = React.lazy(()=> import('./components/Feed'))
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/signin' Component={Signin} />
        <Route element={<PrivateRoutes/>}>
          <Route path='/feed' element={
            <React.Suspense fallback={<div>Loading....</div>}>
              <Profile/>
            </React.Suspense>
          } />
          <Route path='/create/:id' Component={Create}/>
          <Route path='/profile/:id' Component={ProfileSingle} />
          <Route path='/create' Component={Create} />
          <Route path='/comments/:id' Component={Comments} />
          <Route path='/:id/:id' Component={Loading}/>
          <Route path='/userform/:id/:id' Component={Profileform}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
