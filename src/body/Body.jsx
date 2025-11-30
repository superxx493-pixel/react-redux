import React from "react";
import { useCartContext } from "../../../context/cartContext/CartContext";
import ProductCard from "./ProductCard";

const Body = () => {
  const {
    state: { products },
  } = useCartContext();

  return (
    <>
      {products?.length <= 0 ? (
        <div className="w-full h-full flex items-center justify-center mt-6">
          <p className="text-xl font-semibold">Products not available..!!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[1rem] max-[1150px]:grid-cols-2 max-[850px]:grid-cols-1 p-3">
          {products.map((productDetails) => {
            return (
              <ProductCard
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

export default Body;
