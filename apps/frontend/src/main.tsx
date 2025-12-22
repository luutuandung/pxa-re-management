import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'jotai';
import { RouterProvider } from 'react-router';
import { AuthProvider } from "./auth/AuthContext";
import LanguageInitializer from './components/LanguageInitializer';
import { router } from './routes';
import ClientDependenciesInjector from '@/dependencies-injection/ClientDependenciesInjector.ts';
import BusinessUnitKyGateway from '@/gateways/BusinessUnitKyGateway.ts';
import CostPricePatternTypeKyGateway from "@/gateways/CostPricePatternTypeKyGateway.ts";
import CostPriceRegistrationPageKyBFF from '@/BFF/Pages/CostPriceRegistrationPageKyBFF.ts';
import CostPricesVersionsDropDownListKyBFF from '@/BFF/Components/CostPricesVersionsDropDownListKyBFF.ts';
import CostPricePatternsManagementPageKyBFF from "@/BFF/Pages/CostPricePatternsManagementPageKyBFF.ts";

// i18nextの初期化
import './i18n';


ClientDependenciesInjector.setDependencies({
  gateways: {
    businessUnit: new BusinessUnitKyGateway(),
    costPricePatternType: new CostPricePatternTypeKyGateway()
  },
  BFF: {
    pages: {
      costPricePatternsManagement: new CostPricePatternsManagementPageKyBFF(),
      costPriceRegistration: new CostPriceRegistrationPageKyBFF()
    },
    components: {
      costPricesVersionsDropDownList: new CostPricesVersionsDropDownListKyBFF()
    }
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider>
        <AuthProvider>
          <LanguageInitializer>
            <RouterProvider router={router} />
          </LanguageInitializer>
        </AuthProvider>
      </Provider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
