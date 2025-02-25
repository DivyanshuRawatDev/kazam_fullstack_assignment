import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Task from "./components/Task";

// Connect to your Socket.io server
const socket = io("http://localhost:8080");

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch existing tasks when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/fetchAllTasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Listen for new task events from the server
  useEffect(() => {
    socket.on("newTask", (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    // Cleanup the listener on unmount
    return () => {
      socket.off("newTask");
    };
  }, []);

  // Handler for adding a new task
  const handleAdd = () => {
    if (newTask.trim() === "") return;

    const taskObj = { task: newTask };

    // Emit the "add" event via Socket.io to the backend
    socket.emit("add", taskObj);

    // Optionally update the UI immediately (optimistic update)
    setTasks((prevTasks) => [...prevTasks, taskObj]);
    setNewTask("");
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className=" w-full max-w-md h-[60vh] p-5 rounded-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-center">Note App</h1>
        </div>
        <div className="flex gap-5 mt-5">
          <input
            placeholder="New Note"
            className="bg-white py-1 px-2 rounded-lg flex-grow shadow-2xl border-1"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="bg-amber-800 px-4 py-1 rounded-lg text-white"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        <div
          className=" mt-5 px-2 py-1 flex flex-col gap-3 overflow-y-auto"
          style={{ maxHeight: "calc(60vh - 150px)" }}
        >
          <h1 className="font-semibold">Notes</h1>
          {tasks.map((item, index) => (
            <Task key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
