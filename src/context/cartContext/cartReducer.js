export const cartReducer = (state, action) => {
  if(action.type === 'SET_STATE'){
    state = action.payload;
    return state;
  }
  if(action.type === 'SET_PRODUCTS'){
    state = {...state, products: action.payload};
    return state;
  }
  if (action.type === "ADD_TO_CART") {
    state = {
      ...state,
      cart: [
        ...state.cart,
        {
          ...action.payload,
          quantity: 1,
        },
      ],
    };
    return state;
  }
  if (action.type === "REMOVE_FROM_CART") {
    state = {
      ...state,
      cart: state.cart.filter((product) => product.id !== action.payload.id),
    };
    return state;
  }
  if (action.type === "INCREMENT_QUANTITY") {
    state = {
      ...state,
      cart: state.cart.map((product) =>
        product.id === action.payload.id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ),
    };
    return state;
  }
  if (action.type === "DECREMENT_QUANTITY") {
    state = {
      ...state,
      cart: state.cart.map((product) =>
        product.id === action.payload.id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ),
    };
    return state;
  }
};
