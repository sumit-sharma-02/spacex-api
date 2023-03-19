import React from "react";

const Loader = () => {
  return (
    <div className="flex w-full h-72 space-x-1 p-2 items-center justify-center">
      <div
        className="bg-[#da2128]/90 p-2 w-8 h-8 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="bg-[#da2128]/90 p-2 w-8 h-8 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
      <div
        className="bg-[#da2128]/90 p-2  w-8 h-8 rounded-full animate-bounce"
        style={{ animationDelay: "0.6s" }}
      ></div>
    </div>
  );
};

export default Loader;
