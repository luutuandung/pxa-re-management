import type { BusinessUnit } from './business-unit.type';

export const AggClass = {
  ACTUAL: 1, // 実績
  FORECAST: 2, // 見通し
  PLAN: 3, // 計画
} as const;

export type AggClass = (typeof AggClass)[keyof typeof AggClass];

export type AxisOption = {
  buCd: string;
  nameJa: string;
  nameEn: string;
  nameZh: string;
};

export type ScenarioTypeOption = { id: string; name: string };
export type ScenarioBusinessOption = { id: string; name: string };
export type CostVersionOption = { id: string; name: string };
export type RateTypeOption = { value: number; label: string };

export type GetCostScenarioOptionsResponse = {
  axisOptions: AxisOption[];
  scenarioTypes: ScenarioTypeOption[];
  scenarioBusinesses: ScenarioBusinessOption[];
  costVersions: CostVersionOption[];
  rateTypes: RateTypeOption[];
  salesVersions: { id: string; name: string }[];
};

export type ConcatTarget = {
  childBu: BusinessUnit;
  parentBu: BusinessUnit;
  aggConcatId: string;
};

export type GetConcatTargetsResponse = {
  targets: ConcatTarget[];
};

export type AxisDependentBusiness = {
  id: string;
  nameJa: string;
  nameEn: string;
  nameZh: string;
};

export type AxisDependentOptionsResponse = {
  scenarioBusinesses: AxisDependentBusiness[];
  costVersions: { id: string; name: string }[];
};

export type TableRowData = {
  base: string; // 拠点名（集計軸の場合は軸名、それ以外は空）
  classification: string; // 区分（集計軸/親/子）
  salesVersion: string; // 販売バージョンID
  costType: string; // 原価種類ID
  aggConcatId?: string; // 連結ID（適用時に使用）
  buCd?: string; // 事業単位コード
  rowType: 'axis' | 'parent' | 'child'; // 行の種類（集計軸/親/子）
};

export type SelectOption = {
  value: string;
  label: string;
};

export type ScenarioDetail = {
  aggSequence: string;
  buCd: string;
  buName: string;
  shKb: string;
  hbiVer: string;
  costVer: string;
  rateType: string;
};

export type Scenario = {
  aggCycle: string;
  targetBuCd: string;
  scenarioBusinessId: string;
  scenarioDetails: ScenarioDetail[];
};
