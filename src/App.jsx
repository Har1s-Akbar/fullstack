import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Home, Create, Posts} from './components/index';
import Login from './auth/Login';
import Profile from './components/Profile';
import Signin from './auth/Signin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/login' Component={Login} />
        <Route path='/profile' Component={Profile} />
        <Route path='/signin' Component={Signin} />
        <Route path='/create' Component={Create} />
        <Route path='/posts' Component={Posts} />
      </Routes>
    </Router>
  )
}

export default App
