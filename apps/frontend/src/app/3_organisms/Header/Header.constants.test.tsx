import { i18n } from '../../../locales/i18n';
import type { MenuItem } from './Header.constants';

const urlsOf = (items: MenuItem[]): string[] =>
  items.flatMap(item => [item.url, ...(item.submenu ?? []).map(s => s.url)]);

const textsOf = (items: MenuItem[]): string[] =>
  items.flatMap(item => [item.text, ...(item.submenu ?? []).map(s => s.text)]);

describe('Header navigation items', () => {
  let menuItemsMapping: MenuItem[];

  beforeAll(async () => {
    await i18n;
    ({ menuItemsMapping } = await import('./Header.constants'));
  });

  it('does not list the Perimeter page in the top navigation', () => {
    expect(urlsOf(menuItemsMapping)).not.toContain('/perimeter');
    expect(textsOf(menuItemsMapping).join(' ')).not.toMatch(/perimeter/i);
  });

  it('still lists the other top-level pages', () => {
    expect(menuItemsMapping.map(item => item.url)).toEqual(
      expect.arrayContaining(['/borrow', '/earn', '/convert', '/bitocracy']),
    );
  });
});
