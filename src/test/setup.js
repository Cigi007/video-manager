import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = IntersectionObserver;

// Mock ResizeObserver
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = ResizeObserver;

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
}); 