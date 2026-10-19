import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach,afterEach,test,expect } from 'vitest';
import store from '../redux/store';
import { addToCart, clearCartItems } from '../redux/slices/cartSlice';
import { setCredentials,logout } from '../redux/slices/authSlice';
import CartPage from './CartPage';
beforeEach(()=>{store.dispatch(clearCartItems());store.dispatch(logout());});
afterEach(()=>{cleanup();store.dispatch(clearCartItems());store.dispatch(logout());});
const setup=()=>render(<Provider store={store}><MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Routes><Route path='/' element={<CartPage/>}/><Route path='/shipping' element={<p>Checkout page</p>}/></Routes></MemoryRouter></Provider>);
const add=()=>store.dispatch(addToCart({_id:'p1',name:'Bag',description:'',gallery:[],image:'/bag.jpg',category:['Bags'],subCategory:'Bags',price:20,isActive:true,isOnSale:false,countInStock:3,variants:[{size:'M',stock:3}],size:'M',qty:1}));
test('quantity and removal update the actual bag and empty state',()=>{
 add();setup();fireEvent.click(screen.getByRole('button',{name:'+'}));expect(store.getState().cart.cartItems[0].qty).toBe(2);expect(store.getState().cart.itemsPrice).toBe(40);
 fireEvent.click(screen.getByRole('button',{name:'Remove Bag (M)'}));expect(screen.getByRole('heading',{name:'Your bag is waiting.'})).toBeInTheDocument();expect(store.getState().cart.shippingPrice).toBe(0);
});
test('signed-in customers can proceed directly to checkout',async()=>{
 add();store.dispatch(setCredentials({_id:'u1',name:'Test',email:'test@example.com',isAdmin:false}));setup();fireEvent.click(screen.getByRole('button',{name:'Continue to checkout'}));await screen.findByText('Checkout page');
});
test('free-shipping meter shows how much more is needed',()=>{
 add();setup();expect(screen.getByText('USD 4,980.00')).toBeInTheDocument();expect(screen.getByRole('progressbar',{name:'Progress toward free shipping'})).toHaveAttribute('aria-valuenow','0');
});
