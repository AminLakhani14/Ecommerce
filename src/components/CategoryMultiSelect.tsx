import { Dropdown, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';
import { getErrorMessage } from '../utils/getErrorMessage';

interface Props { value: string[]; onChange: (categories: string[]) => void }

const CategoryMultiSelect = ({ value, onChange }: Props) => {
  const { data: categories = [], isLoading, error, refetch } = useGetCategoriesQuery();
  return (
    <Form.Group className='my-3'>
      <Form.Label htmlFor='product-categories'>Categories</Form.Label>
      <Dropdown autoClose='outside'>
        <Dropdown.Toggle id='product-categories' variant='outline-secondary' className='w-100 text-start text-wrap' disabled={isLoading || !!error} aria-describedby='category-help'>
          {isLoading ? 'Loading categories…' : value.length ? value.join(', ') : 'Select categories'}
        </Dropdown.Toggle>
        <Dropdown.Menu className='w-100 p-2' style={{ maxHeight: '280px', overflowY: 'auto' }}>
          {categories.map((category, index) => (
            <Form.Check key={category} id={`product-category-${index}`} className='py-1' label={category}
              checked={value.includes(category)}
              onChange={event => onChange(event.target.checked ? [...value, category] : value.filter(name => name !== category))} />
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Form.Text id='category-help' className='text-muted'>Select one or more categories. Add new ones in <Link to='/admin/settings'>Settings</Link>.</Form.Text>
      {error && <div role='alert' className='text-danger mt-2'>{getErrorMessage(error)} <Button size='sm' variant='link' onClick={() => refetch()}>Retry</Button></div>}
    </Form.Group>
  );
};

export default CategoryMultiSelect;
