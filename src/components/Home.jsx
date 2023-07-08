import React from 'react'
import Profile from './Profile'
import Hero from './Hero'
import { useSelector} from 'react-redux'

function Home() {
  const isLoggedin = useSelector(state => state.reducer.isAuthenticated)
  return (
    <section>
      <Hero/>
    </section>
  
  )
}

export default Home