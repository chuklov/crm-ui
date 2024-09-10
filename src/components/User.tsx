export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const MapUser = (beUser: any): User => {
  const user: User = {
    id: beUser.id,
    username: beUser.username,
    firstName: beUser.firstName,
    lastName: beUser.lastName,
    role: beUser.role || 'user'
  };

  console.log('Mapped User:', user);
  return user;
};