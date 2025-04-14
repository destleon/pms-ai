export const createMedicine = /* GraphQL */ `
  mutation CreateMedicine($input: CreateMedicineInput!) {
    createMedicine(input: $input) {
      id
      name
      description
      price
      quantity
      createdAt
      updatedAt
    }
  }
`;

export const updateMedicine = /* GraphQL */ `
  mutation UpdateMedicine($input: UpdateMedicineInput!) {
    updateMedicine(input: $input) {
      id
      name
      description
      price
      quantity
      createdAt
      updatedAt
    }
  }
`;

export const deleteMedicine = /* GraphQL */ `
  mutation DeleteMedicine($input: DeleteMedicineInput!) {
    deleteMedicine(input: $input) {
      id
      name
      description
      price
      quantity
      createdAt
      updatedAt
    }
  }
`;

export const updateInventory = /* GraphQL */ `
  mutation UpdateInventory($input: UpdateInventoryInput!) {
    updateInventory(input: $input) {
      id
      medicineId
      medicine {
        id
        name
        description
        price
      }
      quantity
      lastUpdated
    }
  }
`;