import React from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { useCartContext } from "../../context/cartContext/CartContext";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";

const CartProductCard = ({ productDetails }) => {
  const {
    state: { cart },
    dispatch,
  } = useCartContext();

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: productDetails,
    });
  };

  const handleRemoveFromCart = () => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: productDetails,
    });
  };

  const handleIncrementQuantity = () => {
    dispatch({
      type: "INCREMENT_QUANTITY",
      payload: productDetails,
    });
  };
  const handleDecrementQuantity = () => {
    if (productDetails.quantity <= 1) return;
    dispatch({
      type: "DECREMENT_QUANTITY",
      payload: productDetails,
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-white/10">
      <figure>
        <img
          src={productDetails.image}
          alt="Shoes"
          className="aspect-video object-cover h-full w-full"
        />
      </figure>

      <div className="card-body">
        <div className="flex items-center gap-5">
          <p>
            <strong>{productDetails.price}</strong> Rs
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleIncrementQuantity}
              className="btn btn-square btn-outline btn-sm"
            >
              <FaPlus />
            </button>
            <span className="font-semibold">{productDetails.quantity}</span>
            <button
              onClick={handleDecrementQuantity}
              className="btn btn-square btn-outline btn-sm"
            >
              <FaMinus />
            </button>
          </div>
        </div>

        {productDetails.inStock ? (
          <p className="text-green-500">
            {productDetails.inStock} items left..!!
          </p>
        ) : (
          <p className="text-red-500">Out Of Stock..!!</p>
        )}

        {productDetails.fastDelivery ? (
          <p className="text-blue-400 flex items-center gap-3">
            Fast Delivery
            <AiOutlineThunderbolt className="mt-1" />
          </p>
        ) : (
          <p className="text-blue-400">5 Days Delivery</p>
        )}

        <div className="card-actions justify-between mt-6">
          {cart.some((p) => p.id === productDetails.id) ? (
            <button
              onClick={handleRemoveFromCart}
              className="btn btn-outline btn-error"
            >
              Remove From Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="btn btn-outline btn-info"
            >
              Add To Cart
            </button>
          )}
          <button
            onClick={handleRemoveFromCart}
            className="btn btn-outline btn-info"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
