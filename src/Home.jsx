import React from "react";
import FilterBar from "./filterBar/FilterBar";
import Body from "./body/Body";

const Home = () => {
  return (
    <div className="flex">
      <div className="max-[570px]:hidden">
      <FilterBar />
      </div>
      <Body />
    </div>
  );
};

export default Home;
