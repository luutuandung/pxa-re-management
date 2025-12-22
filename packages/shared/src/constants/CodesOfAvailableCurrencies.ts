export enum CodesOfAvailableCurrencies {
  japaneseYen = 'JPY',
  unitedStatesDollar = 'USD',
  chineseYuan = 'CNY'
}


export function isAvailableCurrencyCode(currencyCode: string): currencyCode is CodesOfAvailableCurrencies {
  return Object.values<string>(CodesOfAvailableCurrencies).includes(currencyCode);
}
