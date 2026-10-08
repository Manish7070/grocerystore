export const PAGE_SIZE = 12;

export function catalogPage(products, { category = 'All', search = '', page = 1 } = {}) {
  const query = search.trim().toLowerCase();
  const filtered = products.filter((product) =>
    (category === 'All' || product.category === category)
    && (!query || [product.name, product.description, product.category, ...(product.tags || [])]
      .some((value) => String(value || '').toLowerCase().includes(query)))
  ).sort((a, b) => (a.externalId || a._id).localeCompare(b.externalId || b._id, undefined, { numeric: true }));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(totalPages, Number.isSafeInteger(Number(page)) ? Number(page) : 1));
  const start = (currentPage - 1) * PAGE_SIZE;
  return { items: filtered.slice(start, start + PAGE_SIZE), total: filtered.length, totalPages, currentPage, start };
}

export function pageNumbers(current, total) {
  const first = Math.max(1, Math.min(current - 2, total - 4));
  const candidates = new Set([1, total, ...Array.from({ length: 5 }, (_, i) => first + i)]);
  const sorted = [...candidates].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((page, i) => {
    if (i && page - sorted[i - 1] > 1) result.push(`gap-${page}`);
    result.push(page);
  });
  return result;
}
