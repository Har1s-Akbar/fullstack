import React from 'react'
import Profile from './Profile'
import Hero from './Hero'
import { useSelector} from 'react-redux'

function Home() {
  const isLoggedin = useSelector(state => state.reducer.isAuthenticated)
  return (
    <section>
      { isLoggedin ? <Profile/> : <Hero/>
      }
    </section>
  )
}

export default Home