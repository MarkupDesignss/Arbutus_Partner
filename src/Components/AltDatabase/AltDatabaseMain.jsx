import React from 'react'

import SEO from '../../SEO'

import AltDatabaseHero from './AltDatabaseHero'
import AltDBScreener from '../Home/AltDBScreener'
import FreemiumContent from './FreemiumContent'
import AltFundSection from './AltFundSection'

const AltDatabaseMain = () => {
  return (
    <>
      <SEO
        title="Alt Database Screener & Investment Analytics | Arbutus"
        description="Explore Arbutus alternative investment database featuring hedge funds, private equity, venture capital insights, fund analytics and investment screening tools."
        keywords="alternative investment database, hedge fund database, private equity research, venture capital analytics, investment screener, market intelligence"
        image="https://www.markupdesigns.net/arbutus-web/seo/database-banner.jpg"
        url="https://www.markupdesigns.net/arbutus-web/AltDatabaseMain"
      />

      <div>
        <AltDatabaseHero />
        <AltDBScreener />
        <FreemiumContent />
        <AltFundSection />
      </div>
    </>
  )
}

export default AltDatabaseMain