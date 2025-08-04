
import React from "react";

const SeparatorOr: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-6">
      <hr className="w-1/3 border-gray-300 dark:border-gray-600" />
      <span className="mx-4 text-gray-600 dark:text-gray-300 font-bold text-lg">OR</span>
      <hr className="w-1/3 border-gray-300 dark:border-gray-600" />
    </div>
  );
};

export default SeparatorOr;
