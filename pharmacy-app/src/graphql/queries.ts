export const listMedicines = /* GraphQL */ `
  query ListMedicines($limit: Int, $nextToken: String) {
    listMedicines(limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        price
        quantity
        createdAt
        updatedAt
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
      price
      quantity
      createdAt
      updatedAt
    }
  }
`;

export const listInventory = /* GraphQL */ `
  query ListInventory($limit: Int, $nextToken: String) {
    listInventory(limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getInventory = /* GraphQL */ `
  query GetInventory($id: ID!) {
    getInventory(id: $id) {
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