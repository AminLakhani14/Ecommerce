import { formatUSD } from '../../utils/currency';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FiArrowLeft, FiCheck, FiCheckCircle, FiImage, FiPlus, FiSave, FiTrash2, FiUploadCloud, FiX } from 'react-icons/fi';
import CategoryMultiSelect from '../CategoryMultiSelect';
import { productCategories } from '../../utils/categories';
import { productImageUrl } from '../../utils/productImage';
import type { Product, Variant } from '../../types';

interface Props { product?: Product; busy: boolean; onSubmit: (data: FormData) => Promise<void>; onValidationError: (message: string) => void }
const types = ['Perfume', 'T-shirt', 'Shoes', 'Bags', 'Underwear & Basics', 'Jackets', 'Cargo Pants', 'Shorts', 'Backpacks', 'Shirts', 'Dresses', 'Watches', 'Sunglasses'];

function PreviewImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return <div className='preview-image'>{src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : <div className='image-placeholder'><FiImage /><span>{failed ? 'Image unavailable' : 'Your product image'}</span></div>}</div>;
}

export default function ProductEditor({ product, busy, onSubmit, onValidationError }: Props) {
  const editing = !!product;
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState<string[]>(product ? productCategories(product.category) : []);
  const [subCategory, setSubCategory] = useState(product?.subCategory || '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [isOnSale, setIsOnSale] = useState(product?.isOnSale || false);
  const [imageUrl, setImageUrl] = useState(product && /^https?:\/\//i.test(product.image) ? product.image : '');
  const [gallery, setGallery] = useState<File[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>(product?.variants.length ? product.variants.map(variant => ({ ...variant })) : [{ size: '', stock: 0 }]);
  const existingImages = product ? [product.image, ...(product.gallery || [])].filter(Boolean).map(productImageUrl) : [];
  const previews = gallery.length ? uploadUrls : imageUrl.trim() ? [imageUrl.trim(), ...existingImages.slice(1)] : existingImages;
  const validVariants = variants.filter(variant => variant.size.trim());
  const totalStock = validVariants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0);
  const checks = [{ label: 'Product information', done: !!name.trim() && !!description.trim() }, { label: 'Product images', done: !!previews.length }, { label: 'Categories selected', done: !!category.length && !!subCategory }, { label: 'Price & inventory', done: price !== '' && !!validVariants.length }];

  useEffect(() => {
    const urls = gallery.map(file => URL.createObjectURL(file));
    setUploadUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [gallery]);

  const handleFiles = (files: File[]) => {
    const combined = [...gallery, ...files];
    if (combined.length > 6) return onValidationError('Add up to six product images.');
    if (files.some(file => !['image/jpeg', 'image/png', 'image/gif'].includes(file.type) || file.size > 2000000)) return onValidationError('Use JPG, PNG, or GIF images up to 2 MB each.');
    setGallery(combined);
  };
  const changeVariant = (index: number, field: keyof Variant, value: string | number) => setVariants(current => current.map((variant, itemIndex) => itemIndex === index ? { ...variant, [field]: value } : variant));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!category.length) return onValidationError('Select at least one category.');
    if (!name.trim() || !description.trim() || !subCategory) return onValidationError('Complete the product name, description, and sub-category.');
    if (price === '' || !Number.isFinite(Number(price)) || Number(price) < 0) return onValidationError('Enter a valid product price.');
    if (!validVariants.length || variants.some(variant => !variant.size.trim() || !Number.isSafeInteger(variant.stock) || variant.stock < 0)) return onValidationError('Give every variant a size or option and a valid stock quantity.');
    if (new Set(validVariants.map(variant => variant.size.trim().toLowerCase())).size !== validVariants.length) return onValidationError('Each variant must have a unique size or option.');
    if (!previews.length) return onValidationError('Add an image URL or upload a product image.');
    if (imageUrl.trim() && !/^https?:\/\//i.test(imageUrl.trim())) return onValidationError('Use an HTTP or HTTPS image URL.');
    const data = new FormData();
    Object.entries({ name: name.trim(), description: description.trim(), price, category: JSON.stringify(category), subCategory, countInStock: String(totalStock), isOnSale: String(isOnSale), variants: JSON.stringify(validVariants.map(variant => ({ ...variant, size: variant.size.trim() }))) }).forEach(([key, value]) => data.set(key, value));
    if (imageUrl.trim()) data.set('imageUrl', imageUrl.trim());
    gallery.forEach(file => data.append('gallery', file));
    await onSubmit(data);
  };

  return <div className='product-editor'>
    <div className='page-heading'><div><p className='eyebrow'>YOUR PRODUCT CATALOG</p><h1>{editing ? 'Edit Product' : 'Create Product'}</h1><p>{editing ? 'Fine-tune the details that make your product stand out.' : 'Bring something new to your store. Make every detail count.'}</p></div><Link className='button-subtle' to='/admin/productlist'><FiArrowLeft /> Back to products</Link></div>
    <Form id='product-editor-form' onSubmit={submit}>
      <fieldset disabled={busy} className='editor-fieldset'>
        <div className='editor-grid'>
          <div className='editor-primary'>
            <section className='editor-card'><div className='editor-card-heading'><span className='section-number'>01</span><div><h2>Product information</h2><p>A great product starts with the details.</p></div></div>
              <Form.Group controlId='product-name'><Form.Label>Product Name <span className='required-mark'>*</span></Form.Label><Form.Control value={name} onChange={event => setName(event.target.value)} placeholder='e.g., Everyday Canvas Backpack' required maxLength={200} /></Form.Group>
              <Form.Group controlId='product-description' className='mt-4'><Form.Label>Description <span className='required-mark'>*</span></Form.Label><Form.Control as='textarea' rows={5} value={description} onChange={event => setDescription(event.target.value)} placeholder='Tell the story. What makes this product special?' required /><Form.Text>Describe the material, fit, and details your customers will love.</Form.Text></Form.Group>
            </section>
            <section className='editor-card'><div className='editor-card-heading'><span className='section-number'>02</span><div><h2>Media gallery</h2><p>Give your customers a closer look.</p></div><span className='quiet-badge'>{gallery.length || existingImages.length} / 6 images</span></div>
              <label className='upload-zone' htmlFor='product-images' onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (!busy) handleFiles(Array.from(event.dataTransfer.files)); }}>
                <span className='upload-icon'><FiUploadCloud /></span><strong>Drag your images here, or <span>browse files</span></strong><small>JPG, PNG or GIF · Up to 2 MB each · Maximum 6 images</small>
                <input id='product-images' aria-label='Product Images' className='visually-hidden' type='file' multiple accept='image/jpeg,image/png,image/gif' onChange={event => { handleFiles(Array.from(event.target.files || [])); event.target.value = ''; }} />
              </label>
              {!!previews.length && <div className='media-thumbnails'>{previews.map((src, index) => <div key={`${src}-${index}`}><PreviewImage key={src} src={src} alt={`Product image ${index + 1}`} />{index === 0 && <span className='cover-label'>Cover</span>}{gallery.length > 0 && <button type='button' aria-label={`Remove image ${index + 1}`} onClick={() => setGallery(current => current.filter((_file, itemIndex) => index !== itemIndex))}><FiX /></button>}</div>)}</div>}
              <div className='or-divider'><span>or use an image link</span></div>
              <Form.Group controlId='product-image-url'><Form.Label>Image URL</Form.Label><Form.Control type='url' value={imageUrl} onChange={event => setImageUrl(event.target.value)} placeholder='https://example.com/product.jpg' /><Form.Text>{editing ? 'New uploads replace the current gallery when you save.' : 'The first uploaded image becomes your product cover.'}</Form.Text></Form.Group>
            </section>
            <section className='editor-card'><div className='editor-card-heading'><span className='section-number'>03</span><div><h2>Pricing & inventory</h2><p>Set the price and available options.</p></div></div>
              <div className='pricing-grid'><Form.Group controlId='product-price'><Form.Label>Price <span className='required-mark'>*</span></Form.Label><div className='currency-input'><span>USD</span><Form.Control type='number' min='0' step='0.01' required placeholder='0.00' value={price} onChange={event => setPrice(event.target.value)} /></div></Form.Group><div className='stock-summary'><span>Total available stock</span><strong>{totalStock}<small> units</small></strong></div></div>
              <div className='variants-heading'><div><h3>Product variants</h3><p>Use “One Size” for products with a single option.</p></div><button type='button' className='text-button' onClick={() => setVariants(current => [...current, { size: '', stock: 0 }])}><FiPlus /> Add Variant</button></div>
              <div className='variant-list'>{variants.map((variant, index) => <div className='variant-row' key={index}>
                <Form.Group controlId={`variant-size-${index}`}><Form.Label>Option / size</Form.Label><Form.Control required placeholder='e.g., M, 42, One Size' value={variant.size} onChange={event => changeVariant(index, 'size', event.target.value)} /></Form.Group>
                <Form.Group controlId={`variant-stock-${index}`}><Form.Label>Stock</Form.Label><Form.Control required type='number' min='0' step='1' value={variant.stock} onChange={event => changeVariant(index, 'stock', Number(event.target.value))} /></Form.Group>
                <button className='icon-button remove-variant' type='button' aria-label={`Remove variant ${index + 1}`} disabled={variants.length === 1} onClick={() => setVariants(current => current.filter((_variant, itemIndex) => index !== itemIndex))}><FiTrash2 /></button>
              </div>)}</div>
            </section>
          </div>
          <aside className='editor-side'>
            <section className='editor-card'><div className='editor-card-heading'><div><h2>Organization</h2><p>Help the right customers find it.</p></div></div><CategoryMultiSelect value={category} onChange={setCategory} />
              <Form.Group controlId='product-subcategory' className='mt-4'><Form.Label>Sub-Category <span className='required-mark'>*</span></Form.Label><Form.Select required value={subCategory} onChange={event => setSubCategory(event.target.value)}><option value='' disabled>Select a product type</option>{[...new Set([...types, ...(subCategory ? [subCategory] : [])])].map(option => <option key={option}>{option}</option>)}</Form.Select></Form.Group>
              <div className='sale-toggle'><div><strong>Feature in Sale</strong><p>Show this product in the sale collection.</p></div><Form.Check type='switch' id='product-on-sale' label='On Sale' className='sale-switch' checked={isOnSale} onChange={event => setIsOnSale(event.target.checked)} /></div>
            </section>
            <section className='editor-card preview-card'><div className='editor-card-heading'><h2>Live preview</h2><span className='quiet-badge'>STOREFRONT</span></div><PreviewImage key={previews[0] || 'empty'} src={previews[0]} alt={name || 'Product preview'} /><div className='preview-information'><span>{category.length ? category.join(' / ') : 'YOUR COLLECTION'}</span><h3>{name || 'Your product title'}</h3><p>{subCategory || 'Product type'}</p><strong>{formatUSD(price || 0)}</strong>{isOnSale && <span className='status-pill sale'>On sale</span>}</div></section>
            <section className='editor-checklist'><div><FiCheckCircle /><strong>Ready for your storefront</strong><span>{checks.filter(check => check.done).length}/{checks.length}</span></div><ul>{checks.map(check => <li key={check.label} className={check.done ? 'complete' : ''}><span>{check.done && <FiCheck />}</span>{check.label}</li>)}</ul></section>
          </aside>
        </div>
      </fieldset>
      <div className='editor-action-bar'><p><FiCheckCircle /> {editing ? 'Your changes will update the storefront.' : 'Your product will be available after saving.'}</p><div><Link to='/admin/productlist' className='button-subtle'>Cancel</Link><Button type='submit' variant='dark' disabled={busy}><FiSave /> {busy ? (editing ? 'Saving...' : 'Creating...') : editing ? 'Save Changes' : 'Create Product'}</Button></div></div>
    </Form>
  </div>;
}
