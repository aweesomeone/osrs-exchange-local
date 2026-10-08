import { describe, expect, it } from 'vitest';
import { calculateFlipEstimate } from './finance.js';

describe('calculateFlipEstimate', () => {
  it('computes the expected 1% tax scenario with no cap', () => {
    const result = calculateFlipEstimate({ low: 100, high: 120, taxRate: 0.01, quantity: 1 });

    expect(result.status).toBe('ok');
    expect(result.grossSpread).toBe(20);
    expect(result.rawTax).toBe(1);
    expect(result.taxPerItem).toBe(1);
    expect(result.netMarginPerItem).toBe(19);
    expect(result.roiPercent).toBe(19);
  });

  it('applies the per-item cap when configured', () => {
    const result = calculateFlipEstimate({
      low: 1_000_000,
      high: 1_100_000,
      taxRate: 0.01,
      taxCapPerItem: 5_000,
      quantity: 1
    });

    expect(result.status).toBe('ok');
    expect(result.taxPerItem).toBe(5_000);
    expect(result.netMarginPerItem).toBe(95_000);
  });

  it('returns unavailable fields when high or low is missing', () => {
    const result = calculateFlipEstimate({ low: 100, high: null, taxRate: 0.01, quantity: 1 });

    expect(result.status).toBe('insufficient_data');
    expect(result.netMarginPerItem).toBeNull();
    expect(result.roiPercent).toBeNull();
  });

  it('rejects invalid quantity values', () => {
    const result = calculateFlipEstimate({ low: 100, high: 120, taxRate: 0.01, quantity: 0 });
    expect(result.status).toBe('invalid_input');
    expect(result.message).toContain('Quantity');
  });

  it('keeps negative net margin visible', () => {
    const result = calculateFlipEstimate({ low: 100, high: 99, taxRate: 0.01, quantity: 1 });

    expect(result.status).toBe('ok');
    expect(result.netMarginPerItem).toBeLessThan(0);
    expect(result.netMarginPerItem).toBe(-2);
    expect(result.roiPercent).toBe(-2);
  });
});
