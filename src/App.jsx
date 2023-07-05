import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Home} from './components/index';
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
      </Routes>
    </Router>
  )
}

export default App
