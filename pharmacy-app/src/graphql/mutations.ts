export const createMedicine = /* GraphQL */ `
  mutation CreateMedicine($input: CreateMedicineInput!) {
    createMedicine(input: $input) {
      id
      name
      description
      quantity
      price
      expiryDate
      manufacturer
      category
      reorderLevel
      lastUpdated
      updatedBy
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const updateMedicine = /* GraphQL */ `
  mutation UpdateMedicine($input: UpdateMedicineInput!) {
    updateMedicine(input: $input) {
      id
      name
      description
      quantity
      price
      expiryDate
      manufacturer
      category
      reorderLevel
      lastUpdated
      updatedBy
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const deleteMedicine = /* GraphQL */ `
  mutation DeleteMedicine($input: DeleteMedicineInput!) {
    deleteMedicine(input: $input) {
      id
      isDeleted
    }
  }
`;

export const createTransaction = /* GraphQL */ `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      medicineId
      quantity
      totalAmount
      customerName
      customerPhone
      attendantId
      transactionDate
      paymentMethod
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const updateTransaction = /* GraphQL */ `
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      id
      medicineId
      quantity
      totalAmount
      customerName
      customerPhone
      attendantId
      transactionDate
      paymentMethod
      createdAt
      updatedAt
      isDeleted
    }
  }
`;

export const createInventoryAlert = /* GraphQL */ `
  mutation CreateInventoryAlert($input: CreateInventoryAlertInput!) {
    createInventoryAlert(input: $input) {
      id
      medicineId
      alertType
      message
      status
      createdAt
      updatedAt
      resolvedAt
      resolvedBy
      isDeleted
    }
  }
`;

export const resolveInventoryAlert = /* GraphQL */ `
  mutation ResolveInventoryAlert($input: ResolveInventoryAlertInput!) {
    resolveInventoryAlert(input: $input) {
      id
      status
      resolvedAt
      resolvedBy
    }
  }
`;