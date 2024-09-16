import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initialize, selectAppReady, selectCurrentToken } from '../api/authSlice';
import { useLazyUserInfoQuery} from '../api/authApiSlice';

const Header: React.FC = () => {
  const token = useSelector(selectCurrentToken);
  const [userTrigger, {data: user, isLoading, isError }] = useLazyUserInfoQuery();
  const appReady = useSelector(selectAppReady);

useEffect(() => {
  if (appReady && token) {
    console.log('Fetching user info...');
        userTrigger({})
      .then(response => {
        console.log('User info fetched:', response);
      })
      .catch(error => {
        console.log('Error fetching user info:', error);
      });
  }
}, [token, userTrigger]);


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