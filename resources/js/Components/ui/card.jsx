import * as React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`rounded-lg border bg-white shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children }) => {
  return <div className="mb-2 font-semibold">{children}</div>;
};

const CardTitle = ({ children }) => {
  return <h2 className="text-lg font-bold">{children}</h2>;
};

const CardContent = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };
