import React from "react";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-500 font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loading;