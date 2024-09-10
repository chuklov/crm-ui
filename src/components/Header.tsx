import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken } from '../pages/authSlice';
import { MapUser } from './User';

const Header: React.FC = () => {
  const token = useSelector(selectCurrentToken);
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    // Fetch user details from backend API using token
    if (token) {
      fetch(`/users/user_info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => response.json())
      .then((userData) => {
        setUser(MapUser(userData)); // Map the user using MapUser
      });
    }
  }, [token]);

  return (
    <header>
      <div className="header-left">CRM MD</div>
      <div className="header-right">
        {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
      </div>
    </header>
  );
};

export default Header;