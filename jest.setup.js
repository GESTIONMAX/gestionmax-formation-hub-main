// Import des extensions Jest pour le DOM - compatible ESM
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Stub pour les objets qui ne sont pas disponibles dans l'environnement de test
if (typeof window !== 'undefined') {
  // Mock pour localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  // Mock pour matchMedia
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
    writable: true,
  });
}

// Suppression des warnings de console pendant les tests
console.error = jest.fn();
console.warn = jest.fn();
