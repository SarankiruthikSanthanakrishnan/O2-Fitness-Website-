import React from 'react'
import { Helmet } from 'react-helmet-async'
import Getintouch from './Getintouch'
import ContactDetails from './ContactDetails'
import MapSection from './MapSection'

const Contacts = () => {
  return (
    <div>
      <Helmet>
        <title>Contact Us | O2 Fitness Health Care</title>
        <meta name="description" content="Get in touch with O2 Fitness Health Care. Find our contact details, location map, and reach out to our customer support for any inquiries." />
        <meta name="keywords" content="contact us, customer support, O2 fitness location, get in touch" />
      </Helmet>
      <Getintouch />
      <ContactDetails />
      <MapSection />
    </div>
  )
}

export default Contacts