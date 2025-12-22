export enum CostPricesPatternsCategoriesDataTypes {
  model = 0,
  sales = 1,
  retail = 2
}


export function isAvailableCostPricePatternCategoryDataType(
  patternCategoryDataType: number
): patternCategoryDataType is CostPricesPatternsCategoriesDataTypes {
  return Object.values(CostPricesPatternsCategoriesDataTypes).includes(patternCategoryDataType);
}
