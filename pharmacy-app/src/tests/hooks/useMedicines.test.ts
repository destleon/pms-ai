import { renderHook, act } from '@testing-library/react-hooks';
import { API } from 'aws-amplify';
import { useMedicines } from '../../hooks/useMedicines';

// Mock the Amplify API
jest.mock('aws-amplify');

describe('useMedicines', () => {
  const mockMedicines = [
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
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch medicines on mount', async () => {
    // Mock the API.graphql response
    (API.graphql as jest.Mock).mockResolvedValueOnce({
      data: {
        listMedicines: {
          items: mockMedicines,
        },
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useMedicines());

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.medicines).toEqual([]);

    await waitForNextUpdate();

    // After data is loaded
    expect(result.current.loading).toBe(false);
    expect(result.current.medicines).toEqual(mockMedicines);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Failed to fetch medicines');
    (API.graphql as jest.Mock).mockRejectedValueOnce(error);

    const { result, waitForNextUpdate } = renderHook(() => useMedicines());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('should add a new medicine', async () => {
    const newMedicine = {
      name: 'New Medicine',
      description: 'New Description',
      quantity: 50,
      price: 19.99,
      manufacturer: 'New Manufacturer',
      category: 'New Category',
      reorderLevel: 10,
      expiryDate: '2024-12-31',
      lastUpdated: '2024-03-15',
      updatedBy: 'test-user',
    };

    (API.graphql as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          listMedicines: {
            items: mockMedicines,
          },
        },
      })
      .mockResolvedValueOnce({
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

    const { result, waitForNextUpdate } = renderHook(() => useMedicines());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.addMedicine(newMedicine);
    });

    expect(result.current.medicines).toHaveLength(2);
    expect(result.current.medicines[1].name).toBe('New Medicine');
  });

  it('should update a medicine', async () => {
    const updates = {
      name: 'Updated Medicine',
      quantity: 75,
    };

    (API.graphql as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          listMedicines: {
            items: mockMedicines,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          updateMedicine: {
            ...mockMedicines[0],
            ...updates,
          },
        },
      });

    const { result, waitForNextUpdate } = renderHook(() => useMedicines());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.updateMedicineById('1', updates);
    });

    expect(result.current.medicines[0].name).toBe('Updated Medicine');
    expect(result.current.medicines[0].quantity).toBe(75);
  });

  it('should delete a medicine', async () => {
    (API.graphql as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          listMedicines: {
            items: mockMedicines,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          deleteMedicine: {
            id: '1',
          },
        },
      });

    const { result, waitForNextUpdate } = renderHook(() => useMedicines());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.deleteMedicineById('1');
    });

    expect(result.current.medicines).toHaveLength(0);
  });
});