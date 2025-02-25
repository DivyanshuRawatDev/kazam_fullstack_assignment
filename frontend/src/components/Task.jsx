import React from "react";

const Task = ({ item }) => {
  return (
    <div>
      <h1>{item?.task}</h1>
      <hr className="mt-2 border-gray-300 " />
    </div>
  );
};

export default Task;
