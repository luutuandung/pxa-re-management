import { createBrowserRouter } from 'react-router';
import MainLayout from './components/templates/MainLayout';
import BusinessCostItemCodeRegistrationPage from '@/pages/BusinessCostItemCodeRegistration/BusinessCostItemCodeRegistrationPage';
import CostAggregationScenario from './pages/costAggregationScenario';
import CalcRegisterPage from '@/pages/CalcRegister/CalcRegisterPage';
import CalcTypePage from './pages/calcType';
import CostVersionRegistrationPage from '@/pages/CostVersionRegistration/CostVersionRegistrationPage';
import Home from './pages/Home';
import UniformCostItemCodeRegistrationPage from '@/pages/UniformCostItemCodeRegistration/UniformCostItemCodeRegistrationPage.tsx';
import BusinessUnitsCostPricesItemsSettingsPage from
    '@/pages/BusinessUnitsCostPricesItemsSettings/BusinessUnitsCostPricesItemsSettingsPage.tsx';
import CostPriceRegistrationPage from "@/pages/CostPriceRegistration/CostPriceRegistrationPage.tsx";
import CostPricePatternsManagementPage from "@/pages/CostPricePatternsManagement/CostPricePatternsManagementPage.tsx";

// エラーコンポーネント
const ApplicationError = () => {
  return <div>アプリケーションエラーが発生しました</div>;
};

const PageNotFound = () => {
  return <div>ページが見つかりません</div>;
};

const PageLoadFailed = () => {
  return <div>ページの読み込みに失敗しました</div>;
};

const NotFound = () => {
  return <div>404 - ページが見つかりません</div>;
};

/**
 * 現在URLから自動的に基底パスを推測
 * @returns 基底パス
 */
function detectBase(): string {
  const path = window.location.pathname;
  const match = path.match(/^\/[^/]+\/[^/]+/); // 2階層までを basename とする
  return match ? match[0] : '/';
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ApplicationError />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <PageNotFound />,
      },
      {
        path: 'uniformCostItemCodeRegistration',
        element: <UniformCostItemCodeRegistrationPage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'businessCostItemCodeRegistration',
        element: <BusinessCostItemCodeRegistrationPage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'businessCostItemSettings',
        element: <BusinessUnitsCostPricesItemsSettingsPage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'costAggregationScenario',
        element: <CostAggregationScenario />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'calcType',
        element: <CalcTypePage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'calcRegister',
        element: <CalcRegisterPage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'costVersionRegistration',
        element: <CostVersionRegistrationPage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'costPattern',
        element: <CostPricePatternsManagementPage />,
        errorElement: <PageLoadFailed />,
      },
      {
        path: 'costRegister',
        element: <CostPriceRegistrationPage />,
        errorElement: <PageLoadFailed />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
],
{
  basename: detectBase()
}
);
