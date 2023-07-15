import React from 'react'
import Profile from './Profile'
import { useSelector} from 'react-redux'
import Hero from './Hero'

function Home() {
  const isLoggedin = useSelector(state => state.reducer.isAuthenticated)
  return (
    <section>
      <Hero/>
    </section>
  
  )
}

export default Home