export const updateCart = (state) => {
    state.itemsPrice = Number(
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    );
  
    state.shippingPrice = state.itemsPrice > 5000 ? 0 : 200;
    state.taxPrice = 0;
  
    state.totalPrice = (
      state.itemsPrice +
      state.shippingPrice +
      state.taxPrice
    ).toFixed(2);
    
    localStorage.setItem('cart', JSON.stringify(state));
  
    return state;
  };