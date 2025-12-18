import type React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation('home');
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('menu.title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/uniformCostItemCodeRegistration"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.uniformCostItemCodeRegistration.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.uniformCostItemCodeRegistration.description')}</p>
        </Link>

        <Link
          to="/businessCostItemCodeRegistration"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.businessCostItemCodeRegistration.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.businessCostItemCodeRegistration.description')}</p>
        </Link>

        <Link
          to="/businessCostItemSettings"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.businessCostItemSettings.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.businessCostItemSettings.description')}</p>
        </Link>

        <Link
          to="/costAggregationScenario"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.costAggregationScenario.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.costAggregationScenario.description')}</p>
        </Link>

        <Link
          to="/calcType"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.calcType.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.calcType.description')}</p>
        </Link>

        <Link
          to="/calcRegister"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.calcRegister.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.calcRegister.description')}</p>
        </Link>

        <Link
          to="/costVersionRegistration"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.costVersionRegistration.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.costVersionRegistration.description')}</p>
        </Link>

        <Link
          to="/costPattern"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.costPattern.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.costPattern.description')}</p>
        </Link>

        <Link
          to="/costRegister"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">{t('menu.items.costRegister.title')}</h3>
          <p className="text-blue-600 mt-2">{t('menu.items.costRegister.description')}</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
