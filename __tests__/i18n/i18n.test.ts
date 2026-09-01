import { describe, it, expect } from 'vitest';
import { i18nDictionary, translate } from '@/i18n/i18n';

describe('i18n Translation Dictionary', () => {
  it('should maintain exact key parity between French and English dictionaries', () => {
    const frenchKeys = Object.keys(i18nDictionary.fr).sort();
    const englishKeys = Object.keys(i18nDictionary.en).sort();

    expect(frenchKeys).toEqual(englishKeys);
  });

  it('should correctly interpolate dynamic variables', () => {
    const result = translate('fr', 'summary.characterCount', { count: 120 });
    expect(result).toBe('120 caractères');

    const resultEn = translate('en', 'summary.characterCount', { count: 120 });
    expect(resultEn).toBe('120 characters');
  });

  it('should throw an error for non-existent translation keys', () => {
    expect(() => translate('fr', 'non.existent.key')).toThrow(
      '[i18n] Missing translation key: "non.existent.key" for language: "fr"'
    );
  });
});
