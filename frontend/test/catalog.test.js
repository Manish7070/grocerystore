import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { catalogPage, pageNumbers, PAGE_SIZE } from '../src/utils/catalog.js';
import { productArtworkEntries, getProductArtwork } from '../src/utils/productArtwork.js';

const products = productArtworkEntries.map((p, i) => ({ ...p, externalId: p.id, category: p.atlas, _id: String(i) }));

test('240 products occupy 20 distinct pages of 12, with stable ordering', () => {
  assert.equal(PAGE_SIZE, 12);
  const ids = [];
  for (let page = 1; page <= 20; page++) {
    const result = catalogPage(products, { page });
    assert.equal(result.totalPages, 20);
    assert.equal(result.items.length, 12);
    ids.push(...result.items.map(item => item.id));
  }
  assert.equal(new Set(ids).size, 240);
  assert.deepEqual(catalogPage([...products].reverse()).items, catalogPage(products).items);
});

test('category, search, last page and invalid page values are handled', () => {
  assert.equal(catalogPage(products, { category: 'rice' }).total, 15);
  assert.equal(catalogPage(products, { category: 'rice', page: 2 }).items.length, 3);
  assert.equal(catalogPage(products, { search: '  QUINOA ' }).items[0].id, 's-rice-5');
  assert.equal(catalogPage(products, { category: 'fruits', search: 'quinoa' }).total, 0);
  for (const page of [-4, 'bad', '1.5', 0]) assert.equal(catalogPage(products, { page }).currentPage, 1);
  assert.equal(catalogPage(products, { page: 999 }).currentPage, 20);
  assert.deepEqual(catalogPage([], { page: 999 }).items, []);
});

test('numbered controls include boundary windows and do not repeat pages', () => {
  assert.deepEqual(pageNumbers(1, 20), [1, 2, 3, 4, 5, 'gap-20', 20]);
  assert.deepEqual(pageNumbers(20, 20), [1, 'gap-16', 16, 17, 18, 19, 20]);
  assert.deepEqual(pageNumbers(1, 2), [1, 2]);
  assert.deepEqual(pageNumbers(1, 1), [1]);
});

test('every seed product has its own existing atlas cell and historical name fallback', () => {
  const source = readFileSync(new URL('../../backend/routes/products.js', import.meta.url), 'utf8');
  const seedIds = [...source.matchAll(/externalId:\s*['"]([^'"]+)['"]/g)].map(match => match[1]);
  assert.equal(productArtworkEntries.length, 240);
  assert.equal(seedIds.length, 240);
  assert.deepEqual(new Set(seedIds), new Set(productArtworkEntries.map(p => p.id)));
  const cells = new Set();
  for (const entry of productArtworkEntries) {
    const art = getProductArtwork({ externalId: entry.id });
    assert.ok(existsSync(new URL(art.src)));
    assert.deepEqual(art, getProductArtwork({ name: entry.name }));
    assert.ok(art.column >= 0 && art.column < 4 && art.row >= 0 && art.row < 4);
    cells.add(`${art.src}:${art.column}:${art.row}`);
  }
  assert.equal(cells.size, 240);
  assert.equal(getProductArtwork({ name: 'A new product' }), null);
});
