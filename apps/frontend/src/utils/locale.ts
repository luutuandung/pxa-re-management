import type { AxisOption, BusinessUnit } from '@pxa-re-management/shared';

type Lang = 'ja' | 'en' | 'zh';

const normalizeLang = (lang: string): Lang => {
  if (lang === 'en') return 'en';
  if (lang === 'zh') return 'zh';
  return 'ja';
};

export const getAxisLabel = (axis: AxisOption, lang: string): string => {
  const l = normalizeLang(lang);
  return l === 'ja' ? axis.nameJa : l === 'en' ? axis.nameEn : axis.nameZh;
};

export const getBusinessUnitName = (bu: BusinessUnit, lang: string): string => {
  const l = normalizeLang(lang);
  return l === 'ja' ? bu.businessunitNameJa : l === 'en' ? bu.businessunitNameEn : bu.businessunitNameZh;
};

export const getProductName = (bu: BusinessUnit, lang: string): string => {
  const l = normalizeLang(lang);
  return l === 'ja' ? bu.productNameJa : l === 'en' ? bu.productNameEn : bu.productNameZh;
};

export const joinBaseAndProduct = (
  base: string | undefined,
  bu: BusinessUnit | undefined,
  lang: string
): string => {
  const b = base ?? '';
  const p = bu ? getProductName(bu, lang) : '';
  return b && p ? `${b}_${p}` : b || p;
};
