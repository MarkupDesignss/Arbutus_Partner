import React from 'react'

import SEO from '../../SEO'

import AboutHero from './AboutHero'
import AboutAltDB from './AboutAltDB'
import MissionSection from './MissionSection'
import WhatMakesAltDBDifferent from './WhatMakesAltDBDifferent'
import InvestmentKIDCard from './InvestmentKIDCard'

const Aboutmain = () => {
  return (
    <>
      <SEO
        title="About Arbutus | Investment Research & Market Intelligence"
        description="Learn about Arbutus, our mission, alternative investment research expertise, market intelligence solutions and financial analytics platform."
        keywords="about arbutus, investment research company, market intelligence, alternative investments, financial analytics, hedge fund research"
        image="https://www.markupdesigns.net/arbutus-web/seo/about-banner.jpg"
        url="https://www.markupdesigns.net/arbutus-web/Aboutmain"
      />

      <div>
        <AboutHero />
        <AboutAltDB />
        <MissionSection />
        <WhatMakesAltDBDifferent />
        <InvestmentKIDCard />
      </div>
    </>
  )
}

export default Aboutmain