import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Container, Form } from 'react-bootstrap';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiDollarSign, FiLock, FiMail, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearCartItems, saveShippingAddress } from '../redux/slices/cartSlice';
import { useCreateOrderMutation } from '../redux/slices/orderApiSlice';
import { useGetCitiesQuery, useGetCountryQuery, useGetStateCitiesQuery, useGetStatesQuery } from '../redux/slices/locationsApiSlice';
import { getErrorMessage } from '../utils/getErrorMessage';
import OrderSummary from '../components/OrderSummary';
import CitySelect from '../components/CitySelect';
import CheckoutProgress from '../components/CheckoutProgress';
import styles from './styles/Commerce.module.css';

// Delivery is limited to the United States, so the country is fixed rather than chosen.
const COUNTRY='United States', COUNTRY_CODE='US';
const ZIP=/^\d{5}(-\d{4})?$/;

export default function ShippingPage() {
  const navigate=useNavigate(); const dispatch=useAppDispatch();
  const cart=useAppSelector(state=>state.cart);
  const saved=cart.shippingAddress;
  const savedInUS=saved.country===COUNTRY;
  const user=useAppSelector(state=>state.auth.userInfo);
  const [email,setEmail]=useState(saved.email||user?.email||'');
  const [firstName,setFirstName]=useState(saved.firstName||'');
  const [lastName,setLastName]=useState(saved.lastName||'');
  const [address,setAddress]=useState(saved.address||'');
  const [city,setCity]=useState(savedInUS?saved.city||'':'');
  const [region,setRegion]=useState(savedInUS?saved.state||'':'');
  const [postalCode,setPostalCode]=useState(savedInUS?saved.postalCode||'':'');
  const [phone,setPhone]=useState(savedInUS?(saved.phone||'').replace(/^\+1\s*/,''):'');
  const [manualCity,setManualCity]=useState(false);
  const [notice,setNotice]=useState('');
  const country=useGetCountryQuery(COUNTRY_CODE);
  const states=useGetStatesQuery(COUNTRY);
  // Cities are narrowed to the chosen state; if the state list is unavailable, fall back to every city in the country.
  const stateCities=useGetStateCitiesQuery({country:COUNTRY,state:region},{skip:!region||states.isError});
  const countryCities=useGetCitiesQuery(COUNTRY,{skip:!states.isError});
  const cities=states.isError?countryCities:stateCities;
  const needsState=!states.isError&&!region;
  const stateNames=states.currentData||[];
  const [createOrder,{isLoading}]=useCreateOrderMutation();
  const changeState=(value:string)=>{setRegion(value);setCity('');setNotice('');};
  const submit=async (event:React.FormEvent)=>{
    event.preventDefault(); setNotice('');
    if(!cart.cartItems.length)return;
    if(!region.trim())return setNotice('Choose the state you want your order delivered to.');
    if(!city.trim())return setNotice('Choose a city from the suggestions, or enter it manually.');
    if(!email.trim()||!firstName.trim()||!lastName.trim()||!address.trim()||!phone.trim()||!postalCode.trim())return setNotice('Complete the contact and delivery details.');
    if(!ZIP.test(postalCode.trim()))return setNotice('Enter a valid ZIP code, like 10001 or 10001-1234.');
    if(phone.replace(/\D/g,'').replace(/^1(?=\d{10}$)/,'').length!==10)return setNotice('Enter a 10-digit US phone number.');
    const shippingAddress={email:email.trim(),firstName:firstName.trim(),lastName:lastName.trim(),address:address.trim(),city:city.trim(),state:region.trim(),postalCode:postalCode.trim(),country:COUNTRY,phone:`+1 ${phone.trim().replace(/^\+1\s*/,'')}`};
    dispatch(saveShippingAddress(shippingAddress));
    try {
      const result=await createOrder({orderItems:cart.cartItems,shippingAddress,paymentMethod:'Cash on Delivery',itemsPrice:cart.itemsPrice,shippingPrice:cart.shippingPrice,taxPrice:cart.taxPrice,totalPrice:cart.totalPrice}).unwrap();
      dispatch(clearCartItems()); navigate(`/order/${result._id}/thankyou`);
    } catch(error){setNotice(getErrorMessage(error));}
  };
  if(!cart.cartItems.length)return <Container className={styles.page}><section className={styles.empty}><span><FiShoppingBag /></span><h1>Your bag is empty</h1><p>Add your favorites before checking out.</p><Link className='btn btn-dark' to='/'>Explore the store <FiArrowRight /></Link></section></Container>;
  return <Container className={styles.page}>
    <div className={styles.pageHeader}><div><p className='eyebrow'>ALMOST YOURS</p><h1>The last little details.</h1><p>A few details, and your everyday favorites are on their way.</p></div><Link to='/cart' className={styles.backLink}><FiArrowLeft /> Back to your bag</Link></div>
    <CheckoutProgress current={2} />
    <div className={styles.layout}>
      <Form onSubmit={submit} id='checkout-form' className={styles.checkoutForm}>
        <fieldset disabled={isLoading}>
          <section className={styles.formCard}><div className={styles.cardTitle}><span><FiMail /></span><div><h2>Contact information</h2><p>Where should we send your order updates?</p></div><small>01</small></div>
            <Form.Group controlId='shipping-email'><Form.Label>Email address</Form.Label><Form.Control type='email' autoComplete='email' placeholder='you@example.com' value={email} onChange={event=>setEmail(event.target.value)} required /></Form.Group>
          </section>
          <section className={styles.formCard}><div className={styles.cardTitle}><span><FiMapPin /></span><div><h2>Delivery address</h2><p>Tell us where to send your good finds.</p></div><small>02</small></div>
            <div className={styles.fields}>
              <Form.Group controlId='shipping-first-name'><Form.Label>First name</Form.Label><Form.Control autoComplete='given-name' value={firstName} onChange={event=>setFirstName(event.target.value)} required placeholder='First name' /></Form.Group>
              <Form.Group controlId='shipping-last-name'><Form.Label>Last name</Form.Label><Form.Control autoComplete='family-name' value={lastName} onChange={event=>setLastName(event.target.value)} required placeholder='Last name' /></Form.Group>
              <Form.Group controlId='shipping-country' className={styles.fullWidth}><Form.Label>Country / region</Form.Label>
                <div className={styles.lockedField}><span className={styles.flag}>{country.data?.flag?<img src={country.data.flag} alt='' />:COUNTRY_CODE}</span><input id='shipping-country' value={country.data?.name||COUNTRY} readOnly aria-readonly='true' aria-describedby='shipping-country-note' /><span className={styles.lockBadge}><FiLock aria-hidden='true' /> {country.data?.iso3||'USA'}</span></div>
                <p id='shipping-country-note' className={styles.fieldHint}>We currently deliver within the United States only.</p>
              </Form.Group>
              <Form.Group controlId='shipping-address' className={styles.fullWidth}><Form.Label>Street address</Form.Label><Form.Control autoComplete='street-address' placeholder='Street address, apartment, suite' value={address} onChange={event=>setAddress(event.target.value)} required /></Form.Group>
              <Form.Group controlId='shipping-state'><Form.Label>State</Form.Label>{states.isError?<Form.Control autoComplete='address-level1' value={region} onChange={event=>changeState(event.target.value)} placeholder='State' required />:<Form.Select autoComplete='address-level1' value={region} onChange={event=>changeState(event.target.value)} disabled={states.isFetching&&!stateNames.length} required><option value=''>{states.isFetching&&!stateNames.length?'Loading states...':'Select a state'}</option>{region&&!stateNames.includes(region)&&<option>{region}</option>}{stateNames.map(name=><option key={name}>{name}</option>)}</Form.Select>}
                {states.isError&&<div className={styles.locationStatus}>State list unavailable. Enter it manually or <button type='button' onClick={()=>states.refetch()}>retry</button>.</div>}
              </Form.Group>
              <Form.Group controlId='shipping-city'><Form.Label>City</Form.Label>{manualCity||cities.isError?<Form.Control key={region} autoComplete='address-level2' required placeholder='Enter your city' value={city} onChange={event=>setCity(event.target.value)} />:<CitySelect key={region} value={city} options={cities.currentData||[]} onChange={setCity} loading={cities.isFetching} disabled={needsState||cities.isFetching} placeholder={needsState?'Select a state first':region?`Search cities in ${region}`:'Search for your city'} />}
                {cities.isError?<div className={styles.locationStatus}>City list unavailable. Enter your city or <button type='button' onClick={()=>cities.refetch()}>retry</button>.</div>:!needsState&&<button type='button' className={styles.manualLink} disabled={cities.isFetching} onClick={()=>{setManualCity(!manualCity);setCity('');}}>{manualCity?'Choose from city list':"Can't find your city? Enter manually"}</button>}
              </Form.Group>
              <Form.Group controlId='shipping-postal-code'><Form.Label>ZIP code</Form.Label><Form.Control autoComplete='postal-code' inputMode='numeric' maxLength={10} value={postalCode} onChange={event=>setPostalCode(event.target.value)} required placeholder='e.g., 10001' /></Form.Group>
              <Form.Group controlId='shipping-phone'><Form.Label>Phone number</Form.Label><div className={styles.phoneField}><span aria-hidden='true'>+1</span><Form.Control type='tel' autoComplete='tel-national' value={phone} onChange={event=>setPhone(event.target.value)} required placeholder='(555) 123-4567' /></div></Form.Group>
            </div>
          </section>
          <section className={styles.formCard}><div className={styles.cardTitle}><span><FiDollarSign /></span><div><h2>Payment method</h2><p>A simple finish to a good find.</p></div><small>03</small></div>
            <div className={styles.paymentOption}><Form.Check type='radio' id='payment-cod' checked readOnly label='Cash on Delivery (COD)' /><span className={styles.selectedBadge}><FiCheckCircle aria-hidden='true' /> Selected</span><p>Pay in cash when your order is delivered. No card details needed.</p></div>
          </section>
        </fieldset>
        {notice&&<Alert variant='danger' role='alert'>{notice}</Alert>}
        <div className={styles.checkoutActions}><Link to='/cart' className={styles.backLink}><FiArrowLeft /> Return to bag</Link><button type='submit' className={styles.placeOrder} disabled={isLoading}>{isLoading?'Placing your order...':'Place order'} <FiArrowRight /></button></div>
        <p className={styles.submitNote}>Review your delivery details before placing your order.</p>
      </Form>
      <OrderSummary cart={cart} showProducts><Link to='/cart' className={styles.editBag}>Edit your bag <FiArrowRight /></Link></OrderSummary>
    </div>
  </Container>;
}
