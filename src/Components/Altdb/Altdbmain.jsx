import React from 'react'

import SEO from '../../SEO'

import ResearchHero from './ResearchHero'
import AltDBOverview from './AltDBOverview'

const Altdbmain = () => {
  return (
    <>
      <SEO
        title="Investment Research & Market Analysis | Arbutus"
        description="Access in-depth investment research, market analysis, alternative asset insights and financial intelligence tools with Arbutus."
        keywords="investment research, market analysis, financial research, alternative assets, hedge fund analysis, investment intelligence, private equity research"
        image="https://www.markupdesigns.net/arbutus-web/seo/research-banner.jpg"
        url="https://www.markupdesigns.net/arbutus-web/Resarchmain"
      />

      <div>
        <ResearchHero />
        <AltDBOverview />
      </div>
    </>
  )
}

export default Altdbmain