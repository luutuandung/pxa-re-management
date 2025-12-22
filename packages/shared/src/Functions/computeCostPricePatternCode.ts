export function computeCostPricePatternCode(
  {
    hasAtLeastOneModelCategoryType,
    hasAtLeastOneWholesalesCategory,
    hasAtLeastOneRetailCategory
  }: Readonly<{
    hasAtLeastOneModelCategoryType: boolean;
    hasAtLeastOneWholesalesCategory: boolean;
    hasAtLeastOneRetailCategory: boolean;
  }>
): string {

  if (
    hasAtLeastOneModelCategoryType &&
    hasAtLeastOneWholesalesCategory &&
    hasAtLeastOneRetailCategory
  ) {
    return "G";
  }


  if (hasAtLeastOneModelCategoryType && hasAtLeastOneWholesalesCategory) {
    return "D"
  }

  if (hasAtLeastOneModelCategoryType && hasAtLeastOneRetailCategory) {
    return "E";
  }


  if (hasAtLeastOneWholesalesCategory && hasAtLeastOneRetailCategory) {
    return "F";
  }


  if (hasAtLeastOneModelCategoryType) {
    return "A";
  }


  if (hasAtLeastOneWholesalesCategory) {
    return "B";
  }


  if (hasAtLeastOneRetailCategory) {
    return "C";
  }


  throw new Error("全てのパラメーターがfalseになっているシナリオが予想外。");

}
