import React from 'react';
import { apiSlice } from '../api/apiSlice';

// Define a Client interface based on the JSON response
interface Client {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
}

// Extend apiSlice to define the query to get clients
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClients: builder.query<Client[], void>({
      query: () => '/users',
    }),
  }),
});

// Export the auto-generated hook for the query
export const { useGetAllClientsQuery } = extendedApiSlice;

const Clients: React.FC = () => {
  // Use the generated hook to call the API and get clients
  const { data: clients, error, isLoading } = useGetAllClientsQuery();

  return (
    <div className="clients-page">
      <h2>Clients</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p>An error occurred while fetching clients.</p>}
      {clients && (
        <div className="clients-list">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Date of birth</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.username}</td>
                  <td>{client.firstName}</td>
                  <td>{client.lastName}</td>
                  <td>{client.gender}</td>
                  <td>{client.dob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Clients;
