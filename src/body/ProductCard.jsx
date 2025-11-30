import React from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import Ratings from "../../../components/ratings/Ratings";
import { useCartContext } from "../../../context/cartContext/CartContext";

const ProductCard = ({ productDetails }) => {
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
        <h2 className="card-title">
          <span className="line-clamp-1">{productDetails.productName}</span>
          {productDetails.new && (
            <div className="badge badge-secondary">NEW</div>
          )}
        </h2>

        <p className="line-clamp-2">{productDetails.productDescription}</p>

        <p>
          <strong>{productDetails.price}</strong> Rs
        </p>

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

        <Ratings defaultRating={productDetails.ratings} className={"w-4 h-4"} />

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
            onClick={() => alert("Try to implement a fake buy now logic..!!")}
            className="btn btn-outline btn-info"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
