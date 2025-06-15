
import React from "react";

const GlobalPageLoader = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-300 border-t-water"></div>
    <span className="ml-4 text-water font-medium text-lg">Loading...</span>
  </div>
);

export default GlobalPageLoader;
