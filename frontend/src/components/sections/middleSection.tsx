import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MiddleSection = () => {
  return (
    <div className="flex flex-col">

      <main className="flex-grow flex flex-col items-center justify-start px-6 py-[10rem]">

        <h1 className="text-6xl font-extrabold text-center mb-6 leading-tight bg-gradient-to-b from-gray-700 to-gray-950 dark:from-gray-400 dark:to-white bg-clip-text text-transparent">
          A NotesApp built on the <span className="text-gray-800 dark:text-gray-300">MERN</span> Stack
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 py-10 max-w-lg text-center leading-relaxed">
          Developed by <span className="font-semibold text-gray-800 dark:text-gray-300">Jaxsei</span>,
          <span className="font-semibold text-gray-800 dark:text-gray-300"> Nuxtake</span> delivers a seamless user experience with powerful, feature-rich capabilities.
        </p>

        <div className="flex gap-4 py-10">
          <Button asChild variant="default" className="px-4 py-6 text-lg rounded-md">
            <Link to="/signin">Get Started</Link>
          </Button>

          <Button asChild variant="outline" className="px-4 py-6 text-lg rounded-md">
            <Link to="/learn-more">Learn More</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MiddleSection;
