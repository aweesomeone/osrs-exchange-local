export type ProfitInput = {
  low: number | null;
  high: number | null;
  taxRate?: number;
  taxCapPerItem?: number | null;
  quantity: number;
};

export type ProfitStatus = 'ok' | 'insufficient_data' | 'invalid_input';

export type ProfitEstimate = {
  status: ProfitStatus;
  message?: string;
  grossSpread: number | null;
  rawTax: number | null;
  taxPerItem: number | null;
  netSellPerItem: number | null;
  netMarginPerItem: number | null;
  roiPercent: number | null;
  totalCost: number | null;
  grossRevenue: number | null;
  totalTax: number | null;
  netRevenue: number | null;
  totalProfit: number | null;
};

const isInteger = (value: number): boolean => Number.isInteger(value) && Number.isFinite(value);

export function calculateFlipEstimate(input: ProfitInput): ProfitEstimate {
  const { low, high, taxRate = 0.01, taxCapPerItem = null, quantity } = input;

  if (!isInteger(quantity) || quantity < 1) {
    return {
      status: 'invalid_input',
      message: 'Quantity must be a positive integer.',
      grossSpread: null,
      rawTax: null,
      taxPerItem: null,
      netSellPerItem: null,
      netMarginPerItem: null,
      roiPercent: null,
      totalCost: null,
      grossRevenue: null,
      totalTax: null,
      netRevenue: null,
      totalProfit: null
    };
  }

  if (low === null || high === null) {
    return {
      status: 'insufficient_data',
      message: 'Observed high or low price is missing.',
      grossSpread: null,
      rawTax: null,
      taxPerItem: null,
      netSellPerItem: null,
      netMarginPerItem: null,
      roiPercent: null,
      totalCost: null,
      grossRevenue: null,
      totalTax: null,
      netRevenue: null,
      totalProfit: null
    };
  }

  if (
    !Number.isFinite(low) ||
    !Number.isFinite(high) ||
    !isInteger(low) ||
    !isInteger(high) ||
    low <= 0 ||
    high <= 0 ||
    !Number.isFinite(taxRate) ||
    taxRate < 0
  ) {
    return {
      status: 'invalid_input',
      message: 'Low, high, and tax rate must be valid positive values.',
      grossSpread: null,
      rawTax: null,
      taxPerItem: null,
      netSellPerItem: null,
      netMarginPerItem: null,
      roiPercent: null,
      totalCost: null,
      grossRevenue: null,
      totalTax: null,
      netRevenue: null,
      totalProfit: null
    };
  }

  const grossSpread = high - low;
  const rawTax = Math.round(high * taxRate);
  const taxPerItem =
    taxCapPerItem !== null && Number.isFinite(taxCapPerItem) && taxCapPerItem >= 0
      ? Math.min(rawTax, taxCapPerItem)
      : rawTax;
  const netSellPerItem = high - taxPerItem;
  const netMarginPerItem = netSellPerItem - low;
  const roiPercent = low > 0 ? (netMarginPerItem / low) * 100 : null;

  const totalCost = low * quantity;
  const grossRevenue = high * quantity;
  const totalTax = taxPerItem * quantity;
  const netRevenue = grossRevenue - totalTax;
  const totalProfit = netRevenue - totalCost;

  return {
    status: 'ok',
    message: 'Estimated values are based on observed prices and assumed GE tax.',
    grossSpread,
    rawTax,
    taxPerItem,
    netSellPerItem,
    netMarginPerItem,
    roiPercent,
    totalCost,
    grossRevenue,
    totalTax,
    netRevenue,
    totalProfit
  };
}
