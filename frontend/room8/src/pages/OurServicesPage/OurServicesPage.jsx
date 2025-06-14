import React from 'react';
import heroImage from "../../assets/images/heroimage.png"
const services = [
  {
    title: "Room/Roomate search",
    description:
      "Looking for a new room or a roommate you can trust? Room 8 makes it easy to browse available rooms, apartments, or shared spaces that suit your budget and lifestyle. Find people with similar interests, verified profiles, and safe spaces  all in one platform.",
  },
  {
    title: "Communicate directly with landlords",
    description:
      "No agents, no confusion  with Room 8, you can chat directly with landlords or property owners. Ask questions, negotiate rent, and schedule visits without extra fees or delays.\nStay in control of your rental process with clear and direct communication.",
  },
  {
    title: "Preference and Location base search",
    description:
      "We know everyone has different needs. Room 8 lets you search for rooms, apartments, and roommates based on your specific preferences  from price range to location, house rules, amenities, and more.\nFind spaces that match your vibe, in the area you love.",
  },
  {
    title: "Communicate directly with landlords",
    description:
      "Have an empty room, apartment, or house to rent out? Room 8 makes it super easy to create and manage your listings. Upload pictures, set your price, and start connecting with people looking for a space just like yours.\nList your space in minutes and reach the right tenants effortlessly.",
  },
];

const OurServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-24 bg-gray-900 text-white text-center mb-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      >

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-3xl font-extrabold">Our Services</h1>
          <p className="mt-5 text-xl font-bold max-w-2xl mx-auto">
            Explore the features that make Room8 your trusted platform for finding rooms and roommates.
          </p>
          <div className="pt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-5 px-4 sm:px-10 pb-12">
        {services.map((service, index) => (
          <div
            key={index}
            className={`grid sm:grid-cols-3 gap-6 px-4 py-20 ${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <h2 className="text-xl font-bold sm:col-span-1">{service.title}</h2>
            <p className="text-gray-900 font-semibold sm:col-span-2 whitespace-pre-line">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServicesPage;