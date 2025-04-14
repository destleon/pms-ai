import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Custom validation patterns
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/;  // International phone number format

const schema = a.schema({
  // Medicine inventory model
  Medicine: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      quantity: a.integer().required(),
      price: a.float().required(),
      expiryDate: a.string().required(),
      manufacturer: a.string().required(),
      category: a.string().required(),
      reorderLevel: a.integer().required(),
      lastUpdated: a.string().required(),
      updatedBy: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      isDeleted: a.boolean().required().default(false),
    })
    .authorization([
      // Attendants can read and update quantities
      a.allow('group', 'attendant', ['read', 'update'], (r) => !r.isDeleted),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ])
    .index('byCategory', ['category', 'name'])
    .index('byManufacturer', ['manufacturer', 'name'])
    .index('byExpiryDate', ['expiryDate']),

  // Sales/Transaction model
  Transaction: a
    .model({
      medicineId: a.string().required(),
      quantity: a.integer().required(),
      totalAmount: a.float().required(),
      customerName: a.string().optional(),
      customerPhone: a.string().optional().match(PHONE_PATTERN),
      attendantId: a.string().required(),
      transactionDate: a.datetime().required(),
      paymentMethod: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      isDeleted: a.boolean().required().default(false),
    })
    .authorization([
      // Attendants can create and read transactions
      a.allow('group', 'attendant', ['create', 'read'], (r) => !r.isDeleted),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ])
    .index('byAttendant', ['attendantId', 'transactionDate'])
    .index('byDate', ['transactionDate'])
    .index('byMedicine', ['medicineId', 'transactionDate']),

  // Inventory Alert model
  InventoryAlert: a
    .model({
      medicineId: a.string().required(),
      alertType: a.string().required(), // LOW_STOCK, EXPIRING_SOON
      message: a.string().required(),
      status: a.string().required(), // PENDING, RESOLVED
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      resolvedAt: a.datetime().optional(),
      resolvedBy: a.string().optional(),
      isDeleted: a.boolean().required().default(false),
    })
    .authorization([
      // Attendants can read and update alerts
      a.allow('group', 'attendant', ['read', 'update'], (r) => !r.isDeleted),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ])
    .index('byStatus', ['status', 'createdAt'])
    .index('byMedicine', ['medicineId', 'status'])
    .index('byAlertType', ['alertType', 'status']),

  // User Profile model
  UserProfile: a
    .model({
      userId: a.string().required(),
      name: a.string().required(),
      email: a.string().required().match(EMAIL_PATTERN),
      phone: a.string().required().match(PHONE_PATTERN),
      role: a.string().required(), // ADMIN, ATTENDANT
      status: a.string().required(), // ACTIVE, INACTIVE
      lastLogin: a.datetime().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      isDeleted: a.boolean().required().default(false),
    })
    .authorization([
      // Users can read and update their own profile if not deleted
      a.allow('owner', ['read', 'update'], (r) => !r.isDeleted),
      // Admins have full access
      a.allow('group', 'admin', ['create', 'read', 'update', 'delete']),
    ])
    .index('byEmail', ['email'])
    .index('byRole', ['role', 'status'])
    .index('byStatus', ['status', 'role']),
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






