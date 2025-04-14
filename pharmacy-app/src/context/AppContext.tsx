import React, { createContext, useContext, useReducer } from 'react';
import { Medicine, User, Sale, InventoryItem } from '../types';

// Define state types
interface AppState {
  medicines: Medicine[];
  users: User[];
  sales: Sale[];
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
}

// Define action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MEDICINES'; payload: Medicine[] }
  | { type: 'ADD_MEDICINE'; payload: Medicine }
  | { type: 'UPDATE_MEDICINE'; payload: Medicine }
  | { type: 'DELETE_MEDICINE'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'SET_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem };

// Initial state
const initialState: AppState = {
  medicines: [],
  users: [],
  sales: [],
  inventory: [],
  loading: false,
  error: null,
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_MEDICINES':
      return {
        ...state,
        medicines: action.payload,
      };

    case 'ADD_MEDICINE':
      return {
        ...state,
        medicines: [...state.medicines, action.payload],
      };

    case 'UPDATE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.map((medicine) =>
          medicine.id === action.payload.id ? action.payload : medicine
        ),
      };

    case 'DELETE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.filter(
          (medicine) => medicine.id !== action.payload
        ),
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };

    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case 'SET_SALES':
      return {
        ...state,
        sales: action.payload,
      };

    case 'ADD_SALE':
      return {
        ...state,
        sales: [...state.sales, action.payload],
      };

    case 'SET_INVENTORY':
      return {
        ...state,
        inventory: action.payload,
      };

    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    default:
      return state;
  }
};

// Context provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;