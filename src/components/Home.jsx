import React from 'react'
import Profile from './Feed'
import { useSelector} from 'react-redux'
import Hero from './Hero'

function Home() {
  return (
    <section className='main-bg'>
      <Hero/>
    </section>
  
  )
}

export default Home