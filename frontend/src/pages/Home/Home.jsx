import React from 'react'
import Hero from '../../components/Hero/Hero'
import Welcome from '../../components/Welcome/Welcome'
import Choose from '../../components/Choose/Choose'
import StickyCols from '../../components/StickyCols/StickyCols'
import Gallery from '../../components/Gallery/Gallery'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div>
      <Hero />
      <Welcome />
      <Choose />
      <Gallery />
      <StickyCols />
      <Footer />
    </div>
  )
}

export default Home
