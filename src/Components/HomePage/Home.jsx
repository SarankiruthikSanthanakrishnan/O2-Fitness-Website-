import React from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from './Hero'
import ShopCategory from './ShopCategory'
import FeaturedProducts from './FeaturedProducts'
import RelaxationSection from './RelaxationSection'
import WhyChoose from './WhyChoose'
import Reviews from './Reviews'
import ProductRange from './ProductRange'
import WhatsappFloat from '../WhatsappFloating'
import Testimonials from './Testimonials'

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Helmet>
        <title>O2 Fitness Health Care | Best Massage Chairs in India</title>
        <meta name="description" content="Discover premium wellness and fitness products at O2 Fitness Health Care. Quality massage chairs, fitness equipment, and health accessories for a better lifestyle." />
        <meta name="keywords" content="O2 fitness, health care, massage chairs, wellness products, fitness equipment, relaxation" />
      </Helmet>

      <div className="max-w-[100vw] overflow-x-hidden">
        <Hero />
        <ShopCategory />
        <RelaxationSection />
        <FeaturedProducts />
        <WhyChoose />
        <Testimonials />
        <Reviews />
      </div>
    </div>
  )
}

export default Home