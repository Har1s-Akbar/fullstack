import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Home} from './components/index'
import Login from './auth/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/login' Component={Login} />
      </Routes>
    </Router>
  )
}

export default App
