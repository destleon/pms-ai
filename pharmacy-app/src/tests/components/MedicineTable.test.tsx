import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { API } from 'aws-amplify';
import MedicineTable from '../../components/admin/medicine/MedicineTable';

// Mock the Amplify API
jest.mock('aws-amplify');

// Mock the custom hooks
jest.mock('../../hooks/useMedicines', () => ({
  useMedicines: () => ({
    medicines: [
      {
        id: '1',
        name: 'Test Medicine',
        description: 'Test Description',
        quantity: 100,
        price: 9.99,
        manufacturer: 'Test Manufacturer',
        category: 'Test Category',
        reorderLevel: 20,
        expiryDate: '2024-12-31',
        lastUpdated: '2024-03-15',
        updatedBy: 'test-user',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
        isDeleted: false,
      },
    ],
    loading: false,
    error: null,
    addMedicine: jest.fn(),
    updateMedicineById: jest.fn(),
    deleteMedicineById: jest.fn(),
  }),
}));

describe('MedicineTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the medicine table with data', () => {
    render(<MedicineTable />);

    expect(screen.getByText('Medicines')).toBeInTheDocument();
    expect(screen.getByText('Test Medicine')).toBeInTheDocument();
    expect(screen.getByText('Test Manufacturer')).toBeInTheDocument();
  });

  it('opens the add medicine dialog when clicking the add button', () => {
    render(<MedicineTable />);

    fireEvent.click(screen.getByText('Add Medicine'));

    expect(screen.getByText('Add New Medicine')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('opens the edit medicine dialog when clicking the edit button', () => {
    render(<MedicineTable />);

    // Find and click the edit button
    const editButton = screen.getByTestId('edit-button-1');
    fireEvent.click(editButton);

    expect(screen.getByText('Edit Medicine')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Medicine')).toBeInTheDocument();
  });

  it('handles medicine deletion', async () => {
    (API.graphql as jest.Mock).mockResolvedValueOnce({
      data: {
        deleteMedicine: {
          id: '1',
        },
      },
    });

    render(<MedicineTable />);

    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    // Wait for the deletion to complete
    await waitFor(() => {
      expect(API.graphql).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.any(String),
          variables: {
            input: {
              id: '1',
            },
          },
        })
      );
    });
  });

  it('handles form submission for adding a new medicine', async () => {
    const newMedicine = {
      name: 'New Medicine',
      description: 'New Description',
      price: '19.99',
      quantity: '50',
      manufacturer: 'New Manufacturer',
      category: 'New Category',
      reorderLevel: '10',
      expiryDate: '2024-12-31',
    };

    (API.graphql as jest.Mock).mockResolvedValueOnce({
      data: {
        createMedicine: {
          ...newMedicine,
          id: '2',
          createdAt: '2024-03-15',
          updatedAt: '2024-03-15',
          isDeleted: false,
        },
      },
    });

    render(<MedicineTable />);

    // Open the add dialog
    fireEvent.click(screen.getByText('Add Medicine'));

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: newMedicine.name },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: newMedicine.description },
    });
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: newMedicine.price },
    });
    fireEvent.change(screen.getByLabelText('Quantity'), {
      target: { value: newMedicine.quantity },
    });
    fireEvent.change(screen.getByLabelText('Manufacturer'), {
      target: { value: newMedicine.manufacturer },
    });
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: newMedicine.category },
    });
    fireEvent.change(screen.getByLabelText('Reorder Level'), {
      target: { value: newMedicine.reorderLevel },
    });
    fireEvent.change(screen.getByLabelText('Expiry Date'), {
      target: { value: newMedicine.expiryDate },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create'));

    // Wait for the submission to complete
    await waitFor(() => {
      expect(API.graphql).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.any(String),
          variables: {
            input: expect.objectContaining({
              name: newMedicine.name,
              description: newMedicine.description,
            }),
          },
        })
      );
    });
  });
});