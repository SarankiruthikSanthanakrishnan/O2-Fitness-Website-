import React from 'react'
import { Helmet } from 'react-helmet-async'
import About02Fit from './About02Fit'
import WhoWeAre from './WhoWeAre'
import BeliefWellness from './BeliefWellness'
import WhyChooseUs from './WhyChooseUs'
import OurJourny from './OurJourny'
import CustomerSay from './CustomerSay'
import O2ComfortLife from './O2ComfortLife'

const AboutUs = () => {
  return (
    <div>
      <Helmet>
        <title>About Us | O2 Fitness Health Care</title>
        <meta name="description" content="Learn about O2 Fitness Health Care, our mission, and our journey in providing premium massage chairs and fitness solutions." />
        <meta name="keywords" content="about us, O2 fitness health care, company history, mission, wellness solutions" />
      </Helmet>
        <About02Fit />
        <WhoWeAre />
        <BeliefWellness />
        <WhyChooseUs />
        <OurJourny />
        <CustomerSay />
        <O2ComfortLife />
    </div>
  )
}

export default AboutUs