import React from "react";

const AuthForm = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {children}
    </form>
  );
};

export default AuthForm;