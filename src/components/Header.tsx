import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../api/authSlice';
import { useLazyUserInfoQuery } from '../api/authApiSlice';

const Header: React.FC = () => {
  const token = useSelector(selectCurrentToken);
  const [fetchUserInfo, { data: user, isLoading, isError }] = useLazyUserInfoQuery();

useEffect(() => {
  if (token) {
    console.log('Fetching user info...');
    fetchUserInfo(undefined).unwrap()
      .then(response => {
        console.log('User info fetched:', response);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }
}, [token, fetchUserInfo]);

  return (
    <header>
      <div className="header-left">CRM MD</div>
      <div className="header-right">
         {isLoading ? 'Loading...' : isError ? 'Error fetching user info' : user ? `${user.firstName} ${user.lastName}` : 'No user data'}
      </div>
    </header>
  );
};

export default Header;