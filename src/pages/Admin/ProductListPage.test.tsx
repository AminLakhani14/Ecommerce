import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import ProductListPage from './ProductListPage';
vi.mock('../../redux/slices/productsApiSlice', () => ({
 useGetAdminProductsQuery: () => ({ data: Array.from({length:12}, (_,i) => ({_id:String(i),name:`Item ${String(i).padStart(2,'0')}`,subCategory:'Bags',image:'/bag.jpg',category:i===0 ? [] : i%2 ? ['Men','Bags'] : ['Women'],price:100+i,variants:[{size:'One Size',stock:i===0?0:2}],isOnSale:i===1})),isLoading:false }),
 useDeleteProductMutation: () => [vi.fn(), {isLoading:false}],
}));
test('catalog pages, searches, and combines category and status filters', () => {
 render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><ProductListPage /></MemoryRouter>);
 const table = screen.getByRole('table');
 expect(within(table).getAllByRole('row')).toHaveLength(11);
 expect(within(table).getByText('Hidden')).toBeInTheDocument();
 expect(within(table).getByText('No category assigned')).toBeInTheDocument();
 expect(within(table).getByRole('link',{name:'Edit Item 00'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Next page'}));
 expect(within(table).getByText('Item 11')).toBeInTheDocument();
 fireEvent.change(screen.getByLabelText('Search products'),{target:{value:'Item 01'}});
 expect(within(table).getAllByRole('row')).toHaveLength(2);
 fireEvent.change(screen.getByLabelText('Filter by category'),{target:{value:'Women'}});
 expect(screen.getByText('No matching products')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Clear filters'}));
 fireEvent.click(screen.getByRole('button',{name:/Out of stock\s*1/}));
 expect(within(screen.getByRole('table')).getByText('Item 00')).toBeInTheDocument();
 expect(within(screen.getByRole('table')).queryByText('Item 01')).not.toBeInTheDocument();
});
