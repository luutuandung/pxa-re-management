import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'jotai';
import { RouterProvider } from 'react-router';
import LanguageInitializer from './components/LanguageInitializer';
import { router } from './routes';

// i18nextの初期化
import './i18n';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider>
        <LanguageInitializer>
          <RouterProvider router={router} />
        </LanguageInitializer>
      </Provider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
