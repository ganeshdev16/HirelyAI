import React from "react";
import Image from "next/image";

const LogoStrip = () => {
  const companies = [
    {
      name: "Spotify",
      logoPath: "/assets/sopify.png", // Add your Spotify logo here
      alt: "Spotify Logo",
    },
    {
      name: "Slack",
      logoPath: "/assets/slack.png", // Add your Slack logo here
      alt: "Slack Logo",
    },
    {
      name: "Adobe",
      logoPath: "/assets/adobe.png", // Add your Adobe logo here
      alt: "Adobe Logo",
    },
    {
      name: "Asana",
      logoPath: "/assets/asana.png", // Add your Asana logo here
      alt: "Asana Logo",
    },
    {
      name: "Linear",
      logoPath: "/assets/linear.png", // Add your Linear logo here
      alt: "Linear Logo",
    },
  ];

  return (
    <div className="w-full p-8 bg-black flex items-center justify-center">
      <div className=" flex items-center space-x-16">
        {companies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className=" hover:opacity-100 transition-opacity duration-300 cursor-pointer flex-shrink-0"
          >
            <div className="h-12 w-auto flex items-center">
              <Image
                src={company.logoPath}
                alt={company.alt}
                width={120}
                height={48}
                // className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                priority={index < 5} // Only prioritize the first set of logos
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoStrip;
