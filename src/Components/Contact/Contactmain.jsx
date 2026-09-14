import React from 'react'

import SEO from '../../SEO'

import ContactHero from './ContactHero'
import ContactForm from './ContactForm'

const Contactmain = () => {
  return (
    <>
      <SEO
        title="Contact Arbutus | Get in Touch"
        description="Contact Arbutus for investment research inquiries, market intelligence solutions, partnerships, support and business collaborations."
        keywords="contact arbutus, investment research contact, financial analytics support, market intelligence inquiries, business partnerships"
        image="https://www.markupdesigns.net/arbutus-web/seo/contact-banner.jpg"
        url="https://www.markupdesigns.net/arbutus-web/Contactmain"
      />

      <div>
        <ContactHero />
        <ContactForm />
      </div>
    </>
  )
}

export default Contactmain