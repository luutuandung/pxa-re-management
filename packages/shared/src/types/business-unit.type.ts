export interface GetBusinessUnitListResponse {
  businessUnits: BusinessUnitItem[];
}

export interface BusinessUnitItem {
  businessunitId: string;
  buCd: string;
  name: string;
  baseCurrencyName: string;
  businessunitNameJa: string;
  productNameJa: string;
  businessunitNameEn: string;
  productNameEn: string;
  businessunitNameZh: string;
  productNameZh: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}
