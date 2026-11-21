import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import { _limparCachePreferencias } from '@/app/preferencias';

beforeEach(() => {
  // Nos testes, a pessoa já passou pelas boas-vindas (exceto no teste específico delas).
  localStorage.setItem('tm:boasVindas', 'feita');
});

afterEach(() => {
  _limparCachePreferencias();
  cleanup();
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  window.location.hash = '';
});
