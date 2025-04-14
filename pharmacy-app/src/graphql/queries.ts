export const listMedicines = /* GraphQL */ `
  query ListMedicines(
    $filter: ModelMedicineFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMedicines(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getMedicine = /* GraphQL */ `
  query GetMedicine($id: ID!) {
    getMedicine(id: $id) {
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

export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getTransaction = /* GraphQL */ `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
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

export const listInventoryAlerts = /* GraphQL */ `
  query ListInventoryAlerts(
    $filter: ModelInventoryAlertFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInventoryAlerts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const searchMedicines = /* GraphQL */ `
  query SearchMedicines(
    $filter: SearchableMedicineFilterInput
    $sort: [SearchableMedicineSortInput]
    $limit: Int
    $nextToken: String
  ) {
    searchMedicines(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      total
    }
  }
`;