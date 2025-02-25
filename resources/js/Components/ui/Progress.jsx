import * as React from "react";

const Progress = ({ value, max = 100, className = "" }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
};

export { Progress };
