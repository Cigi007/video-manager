import { Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Dočasně vypínáme kontrolu přihlášení
  return children ? children : <Outlet />;
};

export default PrivateRoute; 