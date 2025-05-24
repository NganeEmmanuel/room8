import React from 'react';

const MemberCard = ({ member }) => {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="text-center">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 ${member.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden`}
        >
          <img
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
          />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-3 md:mb-4 text-sm md:text-base">{member.title}</p>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{member.description}</p>
      </div>
    </div>
  );
};

export default MemberCard;