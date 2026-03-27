import React from 'react';
import { assets } from '../../assets/assets';

const TestimonialsSection = () => {

  const expertReviews = [
    {
      name: "Dr. Sarath Wijesinghe",
      role: "Senior Data Scientist at TechFlow",
      image: assets.im2,
      rating: 5,
      feedback: "The Student Help Desk has completely transformed how I connect with aspiring professionals. Uploading my session recordings here allows me to reach hundreds of dedicated students. It's an incredibly well-structured and intuitive platform."
    },
    {
      name: "Thimira Prashan",
      role: "Lead Software Engineer",
      image: assets.im1,
      rating: 5,
      feedback: "I've hosted several industry placement talks on this system. The seamless integration of student enrollment and real-time feedback makes it the perfect bridge between campus learning and the tech industry."
    },
    {
      name: "Suresh de Silva",
      role: "Cybersecurity Analyst",
      image: assets.im3,
      rating: 5,
      feedback: "A fantastic initiative! Being able to share my industry experience through recorded sessions and seeing students actively engage through the platform is incredibly rewarding. Highly recommended!"
    }
  ];

  return (
    <div className="py-16 px-8 md:px-40">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Industry Expert Reviews</h2>
      <p className="md:text-base text-gray-500 mt-3 max-w-2xl mx-auto text-center">
        Hear directly from the leading industry professionals who host exclusive career sessions and share their valuable recordings on our platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {expertReviews.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-100 pb-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-blue-50/50 border-b border-gray-100">
              <img className="h-14 w-14 rounded-full border-2 border-white shadow-sm object-cover" src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1 className="text-lg font-bold text-gray-800">{testimonial.name}</h1>
                <p className="text-gray-600 font-medium text-xs">{testimonial.role}</p>
              </div>
            </div>

            <div className="p-5 pb-7">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-4"
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed italic">"{testimonial.feedback}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
