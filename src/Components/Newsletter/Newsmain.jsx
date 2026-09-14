import React from 'react'

import SEO from '../../SEO'

import NewsHero from './NewsHero'
import NewsGrid from './NewsGrid'
import MediaSlider from './MediaSlider'
import Newsletter from './Newsletter'
import EducationSection from './EducationSection'

const Newsmain = () => {
  return (
    <>
      <SEO
        title="Investment News & Market Insights | Arbutus"
        description="Stay updated with the latest investment news, market trends, financial insights, educational content and alternative investment updates from Arbutus."
        keywords="investment news, financial news, market insights, alternative investments, finance education, market trends, investment research"
        image="https://www.markupdesigns.net/arbutus-web/seo/news-banner.jpg"
        url="https://www.markupdesigns.net/arbutus-web/Newsmain"
      />

      <div>
        <NewsHero />
        <NewsGrid />
        <MediaSlider />
        <Newsletter />
        <EducationSection />
      </div>
    </>
  )
}

export default Newsmain