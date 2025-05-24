import React from 'react';
import MemberCard from '../../components/MemberCard/MemberCard';

const OurTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Ngane Emmanuel",
      title: "Scrum Master",
      description: "Experienced in agile methodologies and team coordination. Passionate about delivering high-quality software solutions and ensuring smooth project execution.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-orange-400",
    },
    {
      id: 2,
      name: "Tekoh Bildad",
      title: "Product Owner",
      description: "Strategic thinker with expertise in product development and user experience. Focused on creating innovative solutions that meet user needs.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-blue-400",
    },
    {
      id: 3,
      name: "Brian",
      title: "Chief Technology Officer",
      description: "Technology leader with extensive experience in software architecture and development. Drives technical innovation and strategic technology decisions.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-green-400",
    },
    {
      id: 4,
      name: "Chi Rosita",
      title: "Chief Financial Officer",
      description: "Financial expert with strong analytical skills and strategic planning experience. Ensures sustainable growth and financial stability.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of professionals working together to create amazing experiences 
              and deliver exceptional results for our clients.
            </p>
          </div>
        </div>
      </div>

      {/* Team Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our team or get in touch to see how we can help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
                Contact Us
              </button>
              <button className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors duration-300">
                View Careers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;