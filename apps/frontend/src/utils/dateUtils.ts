export function normalizeToYearMonth(dateString: string): string | null {
  const normalized = (dateString || '').replaceAll('/', '').replaceAll('-', '').slice(0, 6);
  return normalized || null;
}

export const validateDateRange = (
  startDate: string,
  endDate: string,
  translate: (key: string) => string
): string | null => {
  const normalizedStartingDay = normalizeToYearMonth(startDate);
  const normalizedEndingDay = normalizeToYearMonth(endDate);

  if (normalizedStartingDay === null || normalizedStartingDay.length !== 6 || !/^\d{6}$/.test(normalizedStartingDay)) {
    return null;
  }
  if (normalizedEndingDay === null || normalizedEndingDay.length !== 6 || !/^\d{6}$/.test(normalizedEndingDay)) {
    return null;
  }

  if (normalizedStartingDay > normalizedEndingDay) {
    return translate('messages.startDateAfterEndDate');
  }

  const startingYear = parseInt(normalizedStartingDay.substring(0, 4), 10);
  const startingMonth = parseInt(normalizedStartingDay.substring(4, 6), 10);
  const endingYear = parseInt(normalizedEndingDay.substring(0, 4), 10);
  const endingMonth = parseInt(normalizedEndingDay.substring(4, 6), 10);

  const monthsDiff = (endingYear - startingYear) * 12 + (endingMonth - startingMonth) + 1;

  if (monthsDiff > 36) {
    return translate('messages.periodExceeds36Months');
  }

  return null;
};

