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
import BusinessUnitCostPriceItemKyGateway from "@/gateways/BusinessUnitCostPriceItemKyGateway.ts";
import CurrencyKyGateway from "@/gateways/CurrencyKyGateway.ts";
import CostPricePatternTypeKyGateway from "@/gateways/CostPricePatternTypeKyGateway.ts";
import BusinessUnitsCostPricesItemsSettingsPageKyBFF from "@/BFF/Pages/BusinessUnitsCostPricesItemsSettingsPageKyBFF.ts";
import CostPricePatternsManagementPageKyBFF from "@/BFF/Pages/CostPricePatternsManagementPageKyBFF.ts";
import CostPriceRegistrationPageKyBFF from '@/BFF/Pages/CostPriceRegistrationPageKyBFF.ts';
import CostPricesVersionsDropDownListKyBFF from '@/BFF/Components/CostPricesVersionsDropDownListKyBFF.ts';
// i18nextの初期化
import './i18n';


ClientDependenciesInjector.setDependencies({
  gateways: {
    businessUnit: new BusinessUnitKyGateway(),
    businessUnitCostPriceItem: new BusinessUnitCostPriceItemKyGateway(),
    costPricePatternType: new CostPricePatternTypeKyGateway(),
    currency: new CurrencyKyGateway()
  },
  BFF: {
    pages: {
      businessUnitsCostPricesItemsSettings: new BusinessUnitsCostPricesItemsSettingsPageKyBFF(),
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
