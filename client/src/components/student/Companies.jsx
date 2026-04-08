import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  const features = [
    {
      title: "Kuppi Sessions",
      description: "Join peer-led study groups to clarify difficult concepts, prepare for exams together, and achieve higher grades through collaborative learning.",
      image: assets.kuppi
    },
    {
      title: "Industry Placements",
      description: "Kickstart your career by connecting with top-tier companies. Discover exclusive internship and job opportunities tailored specifically for our students.",
      image: assets.indus
    },
    {
      title: "Extracurricular Activities",
      description: "Enhance your university experience beyond academics. Explore diverse student clubs, sports, and events to build leadership skills and lasting friendships.",
      image: assets.extra
    },
    {
      title: "AI Chat Bot",
      description: "Stuck on a problem at 2 AM? Get instant, accurate answers to your academic queries anytime, anywhere with our intelligent 24/7 AI tutor.",
      image: assets.chatbot
    }
  ];

  return (
    <div className="pt-24 pb-16 md:px-14 px-4 bg-gray-50/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Everything You Need to Succeed</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover all the tools and resources available on the Student Help Desk designed specifically to accelerate your academic journey and career.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">

            {/* Image Placeholder Space - Gray Box */}
            <div className="w-full h-40 bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-200 relative group-hover:border-blue-200 transition-colors">
              {feature.image ? (
                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">{feature.icon}</span>
              )}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-transparent group-hover:border-blue-600 pl-0 group-hover:pl-3 transition-all duration-300">
              {feature.description}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
