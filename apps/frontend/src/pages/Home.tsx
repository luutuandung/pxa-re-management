import type React from 'react';
import { Link } from 'react-router';

const Home: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">管理メニュー</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/uniformCostItemCodeRegistration"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">統一原価項目コード登録</h3>
          <p className="text-blue-600 mt-2">原価項目コードの登録・管理</p>
        </Link>

        <Link
          to="/businessCostItemCodeRegistration"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">事業別原価項目コード登録</h3>
          <p className="text-blue-600 mt-2">事業別原価項目コードの登録・管理</p>
        </Link>

        <Link
          to="/businessCostItemSettings"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">事業別原価項目設定</h3>
          <p className="text-blue-600 mt-2">事業別原価項目の設定・管理</p>
        </Link>

        <Link
          to="/costAggregationScenario"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">原価集計シナリオ</h3>
          <p className="text-blue-600 mt-2">集計シナリオの作成・管理</p>
        </Link>

        <Link
          to="/calcType"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">計算種類</h3>
          <p className="text-blue-600 mt-2">計算種類の登録・管理</p>
        </Link>

        <Link
          to="/calcRegister"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">計算式登録</h3>
          <p className="text-blue-600 mt-2">計算式の登録・管理</p>
        </Link>

        <Link
          to="/costVersionRegistration"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">原価バージョン</h3>
          <p className="text-blue-600 mt-2">原価バージョンの登録・管理</p>
        </Link>

        <Link
          to="/costPattern"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">原価パターン</h3>
          <p className="text-blue-600 mt-2">原価パターンの登録・管理</p>
        </Link>

        <Link
          to="/costRegister"
          className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-800">原価登録</h3>
          <p className="text-blue-600 mt-2">原価値の登録・管理</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
