import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductEditor from '../../components/admin/ProductEditor';
import MessageModal from '../../components/MessageModal';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetAdminProductDetailsQuery, useUpdateProductMutation } from '../../redux/slices/productsApiSlice';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function ProductEditPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetAdminProductDetailsQuery(productId);
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();
  const [notice, setNotice] = useState<{ title: string; message: string; success?: boolean } | null>(null);
  const submit = async (formData: FormData) => {
    try { await updateProduct({ productId, formData }).unwrap(); setNotice({ title: 'Success', message: 'Product updated successfully', success: true }); }
    catch (error) { setNotice({ title: 'Error', message: getErrorMessage(error) }); }
  };
  return <>{isLoading ? <Loader /> : error || !product ? <Message variant='danger'>{getErrorMessage(error)}</Message> : <ProductEditor key={product._id} product={product} busy={isSaving} onSubmit={submit} onValidationError={message => setNotice({ title: 'Error', message })} />}
    <MessageModal show={!!notice} title={notice?.title} message={notice?.message} onHide={() => { const success = notice?.success; setNotice(null); if (success) navigate('/admin/productlist'); }} /></>;
}
