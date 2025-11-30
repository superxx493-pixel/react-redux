import React from "react";
import { useCartContext } from "../../context/cartContext/CartContext";
import CartProductCard from "./CartProductCard";

const CartBody = () => {
  const {
    state: { cart },
  } = useCartContext();

  return (
    <>
      {cart.length <= 0 ? (
        <div className="w-full flex items-center justify-center mt-6 text-xl font-semibold">
          Cart is empty now..!!
        </div>
      ) : (
        <div className="w-full grid grid-cols-3 gap-[1rem] max-[1150px]:grid-cols-2 max-[850px]:grid-cols-1 p-3">
          {cart.map((productDetails) => {
            return (
              <CartProductCard
                key={productDetails.id}
                productDetails={productDetails}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default CartBody;
