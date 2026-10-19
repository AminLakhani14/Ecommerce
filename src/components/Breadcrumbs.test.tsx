import { routeCrumbs } from './Breadcrumbs';
import { describe, expect, it } from 'vitest';
describe('route breadcrumbs', () => {
  it('links product editors back to the catalog', () => {
    expect(routeCrumbs('/admin/product/create')).toEqual([{label:'Home',to:'/'},{label:'Products',to:'/admin/productlist'},{label:'Create product'}]);
    expect(routeCrumbs('/admin/product/123/edit').at(-1)?.label).toBe('Edit product');
  });
  it('decodes category labels and preserves apostrophes', () => {
    expect(routeCrumbs('/category/women%27s%20fashion').at(-1)?.label).toBe("Women's Fashion");
    expect(routeCrumbs('/products/men/cargo%20pants')[1].to).toBe('/category/men');
  });
});
