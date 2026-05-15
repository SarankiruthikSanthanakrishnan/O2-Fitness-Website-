import React from "react";

const REVIEWS = [
  // Left column
  {
    quote:
      "The O2 Supreme Massage Chair is pure bliss! I use it every evening after work — it relieves all my back tension and improves sleep quality. Definitely worth every rupee.",
    name: "Priya",
    user: "Chennai",
  },
  {
    quote:
      "I surprised my parents with the O2 Comfort Recliner. They absolutely love it — the zero-gravity mode is their favourite. Delivery and installation were smooth too.",
    name: "Ramesh",
    user: "Coimbatore",
  },
  {
    quote:
      "After comparing many brands, I chose O2 Wellness Pro. The build quality, leather finish, and massage accuracy are exceptional. It’s like having a spa at home.",
    name: "Vivek Sharma",
    user: "Bangalore",
  },

  // Center stack
  {
    quote:
      "The leg and shoulder massage programs are incredibly relaxing. I can even control everything with the mobile app! Truly advanced technology with a human touch.",
    name: "Meera Joseph",
    user: "Hyderabad",
  },
  {
    quote:
      "Being a software engineer, I sit for long hours. The O2 4D RelaxMax has reduced my back pain drastically. Excellent investment for long-term wellness.",
    name: "Harish Kumar",
    user: "Pune",
  },
  {
    quote:
      "I’ve tried chairs abroad, but O₂’s models match the same quality at half the price. Their customer service in India is fast and reliable — highly recommended!",
    name: "Sneha Patel",
    user: "Mumbai",
  },
  {
    quote:
      "Every evening my whole family takes turns using the chair. It adjusts automatically to each person’s height and posture. Truly intelligent design!",
    name: "Deepak Nair",
    user: "Kochi",
  },

  // Right column
  {
    quote:
      "Loved the overall service experience. The technician installed it the same day and explained every feature clearly. The foot rollers are my favourite part!",
    name: "Anjali Verma",
    user: "Delhi",
  },
  {
    quote:
      "I got the O2 Compact model for my small apartment — surprisingly powerful! It fits perfectly in the corner and looks stylish too.",
    name: "Sanjay Rao",
    user: "Ahmedabad",
  },
  {
    quote:
      "It’s been six months since purchase — still running smoothly. My stress levels have gone down, and even guests ask where I bought it from!",
    name: "Lakshmi Priyan",
    user: "Trichy",
  },
];

const HERO = {
  quote:
    "Buying my O2 Elite Massage Chair was one of the best decisions I’ve ever made. It combines luxury, comfort, and technology so perfectly that it feels like having a personal spa therapist at home. My chronic neck pain is now gone — and relaxation is just one button away.",
  rightBadge: "O2 Fitness Healthcare",
  name: "Mohan Raj",
};

const ReviewCard = ({ quote, name, user }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
    <p className="text-gray-900 leading-relaxed italic">“{quote}”</p>
    <div className="mt-5 pt-4 border-t border-gray-100">
      <p className="text-sm font-semibold text-gray-900">{name}</p>
      <p className="text-xs text-gray-500">{user}</p>
    </div>
  </div>
);

const HeroReview = () => (
  <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-lg transition duration-300">
    <p className="text-lg md:text-xl leading-relaxed font-medium text-gray-900 italic">
      “{HERO.quote}”
    </p>
    <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="text-sm font-semibold text-gray-900">
        {HERO.name} <span className="text-gray-500 text-xs">– Salem</span>
      </div>
      <div className="inline-flex items-center gap-2 text-sm text-gray-700">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold">
          O2
        </span>
        <span className="font-semibold">{HERO.rightBadge}</span>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm uppercase tracking-wide text-orange-600 font-bold">
            Customer Testimonials
          </p>
          <h2 className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900">
            Real Stories from Relaxed Customers
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            See why thousands of Indians trust O2 Fitness Healthcare to bring
            luxury relaxation and wellness into their homes.
          </p>
        </div>

        {/* Mobile / Tablet layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:hidden">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
          <HeroReview />
        </div>

        {/* Desktop layout (3/6/3) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left column */}
          <div className="col-span-3 flex flex-col gap-6">
            <ReviewCard {...REVIEWS[0]} />
            <ReviewCard {...REVIEWS[1]} />
            <ReviewCard {...REVIEWS[2]} />
          </div>

          {/* Center column */}
          <div className="col-span-6 grid grid-rows-[auto_auto_auto] gap-6">
            <ReviewCard {...REVIEWS[3]} />
            <HeroReview />
            <div className="grid grid-cols-2 gap-6">
              <ReviewCard {...REVIEWS[6]} />
              <ReviewCard {...REVIEWS[7]} />
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-3 flex flex-col gap-6">
            <ReviewCard {...REVIEWS[8]} />
            <ReviewCard {...REVIEWS[4]} />
            <ReviewCard {...REVIEWS[9]} />
          </div>
        </div>
      </div>
    </section>
  );
}
