import { useState } from "react";
import brian from "../../assets/images/brian.jpg";
import MemberCard from "../../components/MemberCard/MemberCard.jsx";
import MemberModal from "../../components/MemberCard/MemberModal.jsx";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Ngane Emmanuel",
      title: "Scrum Master",
      description:
        "Dedicated Scrum Master focused on guiding teams to deliver high-quality software efficiently.",
      bio: "Emmanuel is passionate about agile methodologies and fostering a collaborative and productive environment. He ensures that the development process is smooth and that the team is always aiming for continuous improvement.",
      skills: ["Agile Methodologies", "JIRA", "Confluence", "Team Leadership"],
      linkedin: "https://www.linkedin.com/in/ngane-emmanuel",
      github: "https://github.com/nganemmanuel",
      email: "nganeemmanuel06@gmail.com",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-orange-400",
    },
    {
      name: "Tekoh Bildad",
      title: "Product Owner",
      description:
        "Strategic Product Owner with a keen eye for market needs and user-centric design.",
      bio: "Bildad bridges the gap between stakeholders and the development team, ensuring the product vision aligns with business goals and delivers maximum value to users.",
      skills: ["Product Strategy", "User Stories", "Market Analysis", "Roadmap Planning"],
      linkedin: "https://www.linkedin.com/in/tekoh-bildad",
      github: "https://github.com/TekohBildad",
      email: "tekoh@gmail.com",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-blue-400",
    },
    {
      name: "Brian",
      title: "CTO",
      description:
        "Brian, a senior software architect, with expertise in backend development and system design, a perfectionist whose emphasis is on clean code",
      bio: "With over a decade of experience in building scalable and robust systems, Brian leads our technology strategy. He is a strong advocate for best practices and mentors our engineering team to write clean, efficient, and maintainable code.",
      skills: ["System Architecture", "Backend Development", "Springboot/java", "Databases", "DevOps"],
      linkedin: "https://www.linkedin.com/in/marc-brian",
      github: "https://github.com/Bilibri23",
      email: "marccoder697@gmail.com",
      image: brian,
      bgColor: "bg-gray-300",
    },
    {
      name: "Chi Rosita",
      title: "CFO",
      description:
        "Rosita our able Odogwu",
      bio:"Rosita enthousiastic, ready to give her all and learn",
      skills:["desning", "fontend","branding"],
      linkedin: "https://www.linkedin.com/in/rosita",
      github: "https://github.com/rositachi",
      email: "rosita@gmila.com",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-gray-300",
    },
  ];

  const [selectedMember, setSelectedMember] = useState(null);

  const handleCardClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Our Team
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <MemberCard
              key={index}
              member={member}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </main>

      <MemberModal
        isOpen={selectedMember !== null}
        onClose={handleCloseModal}
        member={selectedMember}
      />
    </div>
  );
}