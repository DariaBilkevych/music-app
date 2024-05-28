import React from 'react';

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 flex justify-center items-center z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
};

Loader.excludePlayer = true;
export default Loader;
