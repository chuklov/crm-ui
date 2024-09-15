
export const MapUser = (userData: any) => {
    console.log("MappedUser: ", userData);
    if (!userData) {
      console.error('Error: userData is undefined or null');
      return;
    }

  const user = {
    id: userData.id,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    gender: userData.gender,
    dob: userData.dob,
    kcUuid: userData.kcUuid,
  };

  console.log('Mapped User:', user);
  return user;
};