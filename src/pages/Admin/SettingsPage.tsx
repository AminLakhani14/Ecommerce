import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Form, Modal } from 'react-bootstrap';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../redux/slices/categoriesApiSlice';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Loader from '../../components/Loader';

const SettingsPage = () => {
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryToRemove, setCategoryToRemove] = useState<string | null>(null);
  const { data: categories = [], isLoading, error, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isSaving, error: createError, reset }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isRemoving, error: deleteError, reset: resetDelete }] = useDeleteCategoryMutation();

  const removeHandler = async () => {
    if (!categoryToRemove) return;
    setSuccess('');
    try {
      const result = await deleteCategory(categoryToRemove).unwrap();
      setSuccess(result.message);
      setCategoryToRemove(null);
    } catch { /* Keep the dialog open and show the API error. */ }
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess('');
    try {
      const category = await createCategory({ name: name.trim() }).unwrap();
      setSuccess(`Category “${category.name}” created successfully.`);
      setName('');
    } catch { /* The mutation error is shown below the form. */ }
  };

  return (
    <div className='settings-page'>
      <Link to='/admin/productlist' className='btn btn-light mb-3'>Back to Products</Link>
      <h1>Settings</h1>
      <Card className='p-4 mt-3 shadow-sm'>
        <h2 className='h4'>Product Categories</h2>
        <p className='text-muted'>Create categories for your store. They will appear in the store menu and when creating or editing products.</p>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='category-name' className='mb-3'>
            <Form.Label>Category Name</Form.Label>
            <Form.Control value={name} onChange={event => { setName(event.target.value); setSuccess(''); reset(); }}
              placeholder='e.g., Bags' required maxLength={60} disabled={isSaving} />
          </Form.Group>
          <Button type='submit' variant='dark' disabled={isSaving || !name.trim()}>{isSaving ? 'Adding…' : 'Add Category'}</Button>
        </Form>
        {success && <Alert variant='success' role='status' className='mt-3'>{success}</Alert>}
        {createError && <Alert variant='danger' className='mt-3'>{getErrorMessage(createError)}</Alert>}
        <hr className='my-4' />
        <h3 className='h5'>Available Categories</h3>
        {isLoading ? <Loader /> : error ? <Alert variant='danger'>{getErrorMessage(error)} <Button variant='link' onClick={() => refetch()}>Retry</Button></Alert> : (
          <ul className='list-unstyled mb-0'>
            {categories.map(category => <li key={category} className='d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2 gap-3'>
              <span className='text-break'>{category}</span>
              <Button variant='outline-danger' size='sm' aria-label={`Remove ${category}`} disabled={isSaving || isRemoving}
                onClick={() => { setCategoryToRemove(category); setSuccess(''); resetDelete(); reset(); }}>Remove</Button>
            </li>)}
          </ul>
        )}
      </Card>
      <Modal show={categoryToRemove !== null} onHide={() => { if (!isRemoving) setCategoryToRemove(null); }} centered backdrop={isRemoving ? 'static' : true} keyboard={!isRemoving}>
        <Modal.Header closeButton={!isRemoving}><Modal.Title>Remove Category</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Remove "{categoryToRemove}" from your store menu and product category choices?</p>
          <p className='text-muted mb-0'>This category will be removed from its products. Products will be kept; those with no categories left will be hidden from shoppers until a category is assigned.</p>
          {deleteError && <Alert variant='danger' className='mt-3 mb-0'>{getErrorMessage(deleteError)}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setCategoryToRemove(null)} disabled={isRemoving}>Cancel</Button>
          <Button variant='danger' onClick={removeHandler} disabled={isRemoving}>{isRemoving ? 'Removing...' : 'Remove Category'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsPage;
