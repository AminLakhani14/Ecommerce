import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, test, expect, beforeEach, afterEach } from 'vitest';
import store from '../redux/store';
import { addToCart, clearCartItems, saveShippingAddress } from '../redux/slices/cartSlice';
import ShippingPage from './ShippingPage';
const mocks=vi.hoisted(()=>({create:vi.fn(),stateCities:vi.fn(),countryCities:vi.fn(),fail:false,statesFail:false,loading:false}));
const byState:Record<string,string[]>={'New York':['Albany','New York'],Illinois:['Chicago','Springfield']};
const idle={currentData:undefined,isFetching:false,isError:false,refetch:vi.fn()};
vi.mock('../redux/slices/orderApiSlice',()=>({useCreateOrderMutation:()=>[mocks.create,{isLoading:false}]}));
vi.mock('../redux/slices/locationsApiSlice',()=>({
 useGetCountryQuery:()=>({data:{name:'United States',iso2:'US',iso3:'USA',flag:''}}),
 useGetStatesQuery:()=>({currentData:mocks.statesFail?undefined:['Illinois','New York'],isFetching:false,isError:mocks.statesFail,refetch:vi.fn()}),
 useGetStateCitiesQuery:(arg:{country:string;state:string},options?:{skip?:boolean})=>{if(options?.skip)return idle;mocks.stateCities(arg);return {currentData:mocks.loading?undefined:byState[arg.state],isFetching:mocks.loading,isError:mocks.fail,refetch:vi.fn()};},
 useGetCitiesQuery:(country:string,options?:{skip?:boolean})=>{if(options?.skip)return idle;mocks.countryCities(country);return {currentData:['Chicago','New York'],isFetching:false,isError:false,refetch:vi.fn()};},
}));
const blank={email:'',firstName:'',lastName:'',address:'',city:'',state:'',country:'',phone:'',postalCode:''};
beforeEach(()=>{
 mocks.create.mockReset().mockReturnValue({unwrap:()=>Promise.resolve({_id:'order-1'})});mocks.fail=false;mocks.statesFail=false;mocks.loading=false;mocks.stateCities.mockClear();mocks.countryCities.mockClear();
 store.dispatch(clearCartItems());
 store.dispatch(saveShippingAddress(blank));
 store.dispatch(addToCart({_id:'p1',name:'Travel bag',description:'',gallery:[],image:'/bag.jpg',category:['Bags'],subCategory:'Bags',price:20,isActive:true,isOnSale:false,countInStock:2,variants:[{size:'M',stock:2}],size:'M',qty:1}));
});
afterEach(()=>{cleanup();store.dispatch(clearCartItems());});
const setup=()=>render(<Provider store={store}><MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}} initialEntries={['/shipping']}><Routes><Route path='/shipping' element={<ShippingPage/>}/><Route path='/order/:id/thankyou' element={<p>Order confirmed</p>}/></Routes></MemoryRouter></Provider>);
const fill=(zip='10001')=>{for(const [label,value] of [['Email address','test@example.com'],['First name','Test'],['Last name','Shopper'],['Street address','123 Main Street'],['ZIP code',zip],['Phone number','(212) 555-0123']])fireEvent.change(screen.getByLabelText(label),{target:{value}});};
const chooseCity=(typed:string,city:string)=>{fireEvent.change(screen.getByRole('combobox',{name:'City'}),{target:{value:typed}});fireEvent.click(within(screen.getByRole('listbox',{name:'Cities'})).getByRole('option',{name:city}));};
test('locks the country to the United States, filters cities by state, and submits the US address',async()=>{
 setup();
 const country=screen.getByLabelText('Country / region');expect(country).toHaveValue('United States');expect(country).toHaveAttribute('readonly');
 expect(screen.getByRole('combobox',{name:'City'})).toBeDisabled();
 fireEvent.change(screen.getByLabelText('State'),{target:{value:'Illinois'}});
 expect(mocks.stateCities).toHaveBeenLastCalledWith({country:'United States',state:'Illinois'});
 fireEvent.change(screen.getByRole('combobox',{name:'City'}),{target:{value:'i'}});
 expect(screen.queryByRole('option',{name:'Albany'})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('option',{name:'Chicago'}));
 fireEvent.change(screen.getByLabelText('State'),{target:{value:'New York'}});
 expect(screen.getByRole('combobox',{name:'City'})).toHaveValue('');
 chooseCity('New','New York');fill();
 fireEvent.click(screen.getByRole('button',{name:'Place order'}));
 await screen.findByText('Order confirmed');
 expect(mocks.create.mock.calls[0][0].shippingAddress).toMatchObject({country:'United States',state:'New York',city:'New York',postalCode:'10001',phone:'+1 (212) 555-0123'});
 expect(mocks.create.mock.calls[0][0].paymentMethod).toBe('Cash on Delivery');
 expect(mocks.countryCities).not.toHaveBeenCalled();
});
test('a saved address from another country is not reused',()=>{
 store.dispatch(saveShippingAddress({...blank,country:'Pakistan',state:'Sindh',city:'Karachi',postalCode:'75500'}));setup();
 expect(screen.getByLabelText('Country / region')).toHaveValue('United States');expect(screen.getByLabelText('State')).toHaveValue('');expect(screen.getByLabelText('ZIP code')).toHaveValue('');
});
test('typing a city without choosing a suggestion cannot submit an incorrect city',async()=>{
 const {container}=setup();fireEvent.change(screen.getByLabelText('State'),{target:{value:'New York'}});
 fireEvent.change(screen.getByRole('combobox',{name:'City'}),{target:{value:'Not a selected city'}});
 fireEvent.submit(container.querySelector('form')!);
 expect(await screen.findByRole('alert')).toHaveTextContent('Choose a city');expect(mocks.create).not.toHaveBeenCalled();
});
test('non-US ZIP codes are rejected',async()=>{
 const {container}=setup();fireEvent.change(screen.getByLabelText('State'),{target:{value:'New York'}});chooseCity('Alb','Albany');fill('M5V 1A1');
 fireEvent.submit(container.querySelector('form')!);
 expect(await screen.findByRole('alert')).toHaveTextContent('valid ZIP code');expect(mocks.create).not.toHaveBeenCalled();
});
test('city API failure offers manual entry without blocking checkout',()=>{
 mocks.fail=true;setup();fireEvent.change(screen.getByLabelText('State'),{target:{value:'New York'}});expect(screen.getByText(/City list unavailable/)).toBeInTheDocument();
 fireEvent.change(screen.getByLabelText('City'),{target:{value:'New York'}});expect(screen.getByLabelText('City')).toHaveValue('New York');expect(screen.getByRole('button',{name:'retry'})).toBeInTheDocument();
});
test('state API failure falls back to every city in the United States',()=>{
 mocks.statesFail=true;setup();expect(screen.getByText(/State list unavailable/)).toBeInTheDocument();
 expect(mocks.countryCities).toHaveBeenCalledWith('United States');
 chooseCity('Chi','Chicago');expect(screen.getByRole('combobox',{name:'City'})).toHaveValue('Chicago');
});
test('city selection is disabled while a new list is loading',()=>{
 mocks.loading=true;setup();fireEvent.change(screen.getByLabelText('State'),{target:{value:'Illinois'}});expect(screen.getByRole('combobox',{name:'City'})).toBeDisabled();
});
