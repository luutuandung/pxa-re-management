import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'jotai';
import { RouterProvider } from 'react-router';
import { AuthProvider, AuthLoadingView } from "./auth/AuthContext";
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
// i18nextの初期化（リソース読み込み完了までアプリを描画しない）
import { whenInitialResourcesLoaded } from './i18n';


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

function AppWithI18nReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    whenInitialResourcesLoaded.then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <StrictMode>
        <Provider>
          <AuthProvider>
            <AuthLoadingView />
          </AuthProvider>
        </Provider>
      </StrictMode>
    );
  }

  return (
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
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<AppWithI18nReady />);
} else {
  console.error('Root element not found');
}
