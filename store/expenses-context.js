import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@expenses';

const ExpensesContext = createContext({
  expenses: [],
  addExpense: (expenseData) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, expenseData) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
      return action.payload;
    case 'UPDATE': {
      const updatableIndex = state.findIndex((e) => e.id === action.payload.id);
      if (updatableIndex === -1) return state;
      const updatedItem = { ...state[updatableIndex], ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableIndex] = updatedItem;
      return updatedExpenses;
    }
    case 'DELETE':
      return state.filter((e) => e.id !== action.payload);
    default:
      return state;
  }
}

export function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({ type: 'SET', payload: parsed });
        }
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchExpenses();
  }, []);

  useEffect(() => {
    async function saveExpenses() {
      if (!isLoaded) return;
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expensesState));
      } catch (error) {
        console.error('Erro ao salvar despesas:', error);
      }
    }
    saveExpenses();
  }, [expensesState, isLoaded]);

  function addExpense(expenseData) {
    const id = new Date().toISOString() + Math.random().toString();
    dispatch({ type: 'ADD', payload: { ...expenseData, id } });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: 'UPDATE', payload: { id, data: expenseData } });
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses: expensesState,
        addExpense,
        deleteExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses deve ser usado dentro de um ExpensesContextProvider');
  }
  return context;
}