import React, { useState } from 'react';
import { apiSlice } from '../api/apiSlice';

interface Supplement {
  id: number;
  name: string;
  iHerbLink: string;
  comment: string;
}

export const supplementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSupplements: builder.query<Supplement[], void>({
      query: () => '/supplements',
    }),
    addSupplement: builder.mutation<Supplement, Partial<Supplement>>({
      query: (newSupplement) => ({
        url: '/supplements',
        method: 'POST',
        body: newSupplement,
      }),
    }),
  }),
});

const { useGetSupplementsQuery, useAddSupplementMutation } = supplementsApiSlice;

const Supplements: React.FC = () => {
  const { data: supplements, error, isLoading, refetch } = useGetSupplementsQuery();
  const [addSupplement, { isSuccess }] = useAddSupplementMutation();

  const [newSupplement, setNewSupplement] = useState<Partial<Supplement>>({
    name: '',
    iHerbLink: '',
    comment: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSupplement = async () => {
      console.log('Add supplement called');
    try {
      if (newSupplement.name && newSupplement.iHerbLink && newSupplement.comment) {
        await addSupplement(newSupplement).unwrap(); // Ensure it waits for the backend response
        setNewSupplement({ name: '', iHerbLink: '', comment: '' });
        setIsAdding(false); // Hide the form after successful submission
        refetch(); // Optionally refetch supplements to update the list
      } else {
        alert('Please fill out all fields.');
      }
    } catch (error) {
      console.error('Failed to save supplement:', error);
    }
  };

  return (
    <div>
      <h2>Welcome to Supplements</h2>

      {isLoading && <p>Loading supplements...</p>}
      {error && <p>Failed to fetch supplements.</p>}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>iHerb Link</th>
            <th>Comments</th>
            <th>Actions</th>
            <th>
              {!isAdding && (
                <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                  Add
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {supplements &&
            supplements.map((supplement: Supplement) => (
              <tr key={supplement.id}>
                <td>{supplement.id}</td>
                <td>{supplement.name}</td>
                <td>{supplement.iHerbLink}</td>
                <td>{supplement.comment}</td>
                <td>
                  <button className="btn btn-secondary">Edit</button>
                </td>
              </tr>
            ))}

          {isAdding && (
            <tr>
              <td>Auto</td>
              <td>
                <input
                  type="text"
                  value={newSupplement.name}
                  onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newSupplement.iHerbLink}
                  onChange={(e) => setNewSupplement({ ...newSupplement, iHerbLink: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newSupplement.comment}
                  onChange={(e) => setNewSupplement({ ...newSupplement, comment: e.target.value })}
                />
              </td>
              <td>
                <button className="btn btn-success" onClick={handleAddSupplement}>
                  Save
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Supplements;