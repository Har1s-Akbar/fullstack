import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Home, Create, Comments, ProfileSingle, Nav} from './components/index';
import PrivateRoutes from './utils/PrivateRoutes';
import Signin from './auth/Signin';
import React from 'react';
import Loading from './components/Loading';
import Profileform from './components/Profileform';
import Profile from './components/Feed';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
        <Route exact path='/signin' Component={Signin} />
        <Route element={<PrivateRoutes/>}>
          <Route exact path='/feed' element={<Profile/>} />
          <Route path='/create/:id' Component={Create}/>
          <Route path='/profile/:id' Component={ProfileSingle} />
          <Route exact path='/create' Component={Create} />
          <Route path='/comments/:id' Component={Comments} />
          <Route path='/:id/:id' Component={Loading}/>
          <Route path='/userform/:id/:id' Component={Profileform}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
