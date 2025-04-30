import React from 'react';

export const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  userType: null, // 'student', 'teacher', or 'admin'
});

export const useAuth = () => {
  return React.useContext(AuthContext);
};