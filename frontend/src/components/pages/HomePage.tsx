import React from 'react'
import Navbar from '../sections/navbar/default'
import MiddleSection from '../sections/middleSection'
import FeaturesSection from '../sections/featureCardsSection'
import FooterSection from '../sections/footer/default'

function HomePage() {
  return (
    <>
      <Navbar />
      <MiddleSection />
      <FeaturesSection />
      <FooterSection />
    </>
  )
}

export default HomePage
