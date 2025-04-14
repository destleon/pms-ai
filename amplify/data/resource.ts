import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Medicine inventory model
  Medicine: a
    .model({
      name: a.string(),
      description: a.string(),
      quantity: a.integer(),
      price: a.float(),
      expiryDate: a.string(),
      manufacturer: a.string(),
      category: a.string(),
      reorderLevel: a.integer(),
      lastUpdated: a.string(),
      updatedBy: a.string(),
    })
    .authorization([
      // Attendants can read and update quantities
      a.allow('group', 'attendant', ['read', 'update']),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ]),

  // Sales/Transaction model
  Transaction: a
    .model({
      medicineId: a.string(),
      quantity: a.integer(),
      totalAmount: a.float(),
      customerName: a.string().optional(),
      customerPhone: a.string().optional(),
      attendantId: a.string(),
      transactionDate: a.string(),
      paymentMethod: a.string(),
    })
    .authorization([
      // Attendants can create and read transactions
      a.allow('group', 'attendant', ['create', 'read']),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ]),

  // Inventory Alert model
  InventoryAlert: a
    .model({
      medicineId: a.string(),
      alertType: a.string(), // LOW_STOCK, EXPIRING_SOON
      message: a.string(),
      status: a.string(), // PENDING, RESOLVED
      createdAt: a.string(),
      resolvedAt: a.string().optional(),
      resolvedBy: a.string().optional(),
    })
    .authorization([
      // Attendants can read and update alerts
      a.allow('group', 'attendant', ['read', 'update']),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ]),

  // User Profile model
  UserProfile: a
    .model({
      userId: a.string(),
      name: a.string(),
      email: a.string(),
      phone: a.string(),
      role: a.string(), // ADMIN, ATTENDANT
      status: a.string(), // ACTIVE, INACTIVE
      lastLogin: a.string(),
    })
    .authorization([
      // Users can read and update their own profile
      a.allow('owner'),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

