import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductEditor from '../../components/admin/ProductEditor';
import MessageModal from '../../components/MessageModal';
import { useCreateProductMutation } from '../../redux/slices/productsApiSlice';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [notice, setNotice] = useState<{ title: string; message: string; success?: boolean } | null>(null);
  const submit = async (data: FormData) => {
    try { await createProduct(data).unwrap(); setNotice({ title: 'Success', message: 'Product created successfully', success: true }); }
    catch (error) { setNotice({ title: 'Error', message: getErrorMessage(error) }); }
  };
  return <><ProductEditor busy={isLoading} onSubmit={submit} onValidationError={message => setNotice({ title: 'Error', message })} />
    <MessageModal show={!!notice} title={notice?.title} message={notice?.message} onHide={() => { const success = notice?.success; setNotice(null); if (success) navigate('/admin/productlist'); }} /></>;
}
