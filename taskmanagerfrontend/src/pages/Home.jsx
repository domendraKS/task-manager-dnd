import React, { useEffect, useState } from "react";
import {
  Button,
  HR,
  Label,
  Modal,
  Select,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewData, setShowViewData] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
  });
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const { userTask } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [taskUpdateId, setTaskUpdateId] = useState(null);

  useEffect(() => {
    if (!userTask) {
      navigate("/signup");
      return;
    }
    getAllTasks();
  }, [userTask, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onDragEnd = async (result) => {
    try {
      const response = await axios.patch(
        `http://localhost:3201/api/task/update/${result.draggableId}`,
        {
          status: result.destination.droppableId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setTasks(
          tasks.map((task) => {
            if (result.draggableId === task._id) {
              return { ...task, status: result.destination.droppableId };
            }
            return task;
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const getAllTasks = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3201/api/task/getAll",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  }

  const handleShowViewModal = (task) => {
    setShowViewModal(true);
    setShowViewData(task);
  };

  const cancelShowViewModal = () => {
    setShowViewModal(false);
    setShowViewData({});
  };

  const handleShowDeleteModal = (taskId) => {
    setShowDeleteModal(true);
    setDeleteTaskId(taskId);
  };

  const cancelShowDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTaskId(null);
  };

  const handleShowEditModal = (task) => {
    setShowEditModal(true);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setTaskUpdateId(task._id);
  };

  const cancelShowEditModal = () => {
    setShowEditModal(false);
    setFormData({
      title: "",
      description: "",
      status: "Todo",
    });
    setTaskUpdateId(null);
  };

  const deleteTask = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3201/api/task/delete/${deleteTaskId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setTasks(tasks.filter((t) => t._id !== deleteTaskId));
        cancelShowDeleteModal();
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editTask = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3201/api/task/update/${taskUpdateId}`,
        {
          title: formData.title,
          description: formData.description,
          status: formData.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        getAllTasks();
        cancelShowEditModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-blue-100 p-4 min-h-screen">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-sky-700">Task Board</h1>
            <Button onClick={() => navigate("/add-task")} size="sm">
              Add Task
            </Button>
          </div>
          {loading ? (
            <div className="min-w-full min-h-full flex justify-center items-center">
              <Spinner size="xl" />
            </div>
          ) : tasks.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Droppable droppableId={"Todo"}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white rounded-lg shadow p-3"
                    >
                      <h2 className="text-lg font-semibold mb-2">Todo</h2>
                      {getTasksByStatus("Todo").map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-blue-50 p-2 rounded-lg mb-3"
                            >
                              <h3 className="font-bold">
                                {task.title.length > 30
                                  ? `${task.title.substring(0, 30)}...`
                                  : task.title}
                              </h3>
                              <p className="text-sm">
                                {task.description.length > 80
                                  ? `${task.description.substring(0, 80)}...`
                                  : task.description}
                              </p>
                              <p className="text-xs text-gray-500 text-right mt-1">
                                Created at: {formatDate(task.createdAt)}
                              </p>
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  size="xs"
                                  onClick={() => handleShowViewModal(task)}
                                >
                                  View
                                </Button>
                                <Button
                                  color="warning"
                                  size="xs"
                                  onClick={() => handleShowEditModal(task)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="failure"
                                  size="xs"
                                  onClick={() =>
                                    handleShowDeleteModal(task._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId={"InProgress"}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white rounded-lg shadow p-3"
                    >
                      <h2 className="text-lg font-semibold mb-2">InProgress</h2>
                      {getTasksByStatus("InProgress").map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-blue-50 p-2 rounded-lg mb-3"
                            >
                              <h3 className="font-bold">
                                {task.title.length > 30
                                  ? `${task.title.substring(0, 30)}...`
                                  : task.title}
                              </h3>
                              <p className="text-sm">
                                {task.description.length > 80
                                  ? `${task.description.substring(0, 80)}...`
                                  : task.description}
                              </p>
                              <p className="text-xs text-gray-500 text-right mt-1">
                                Created at: {formatDate(task.createdAt)}
                              </p>
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  size="xs"
                                  onClick={() => handleShowViewModal(task)}
                                >
                                  View
                                </Button>
                                <Button
                                  color="warning"
                                  size="xs"
                                  onClick={() => handleShowEditModal(task)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="failure"
                                  size="xs"
                                  onClick={() =>
                                    handleShowDeleteModal(task._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId={"Done"}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white rounded-lg shadow p-3"
                    >
                      <h2 className="text-lg font-semibold mb-2">Done</h2>
                      {getTasksByStatus("Done").map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-blue-50 p-2 rounded-lg mb-3"
                            >
                              <h3 className="font-bold">
                                {task.title.length > 30
                                  ? `${task.title.substring(0, 30)}...`
                                  : task.title}
                              </h3>
                              <p className="text-sm">
                                {task.description.length > 80
                                  ? `${task.description.substring(0, 80)}...`
                                  : task.description}
                              </p>
                              <p className="text-xs text-gray-500 text-right mt-1">
                                Created at: {formatDate(task.createdAt)}
                              </p>
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  size="xs"
                                  onClick={() => handleShowViewModal(task)}
                                >
                                  View
                                </Button>
                                <Button
                                  color="warning"
                                  size="xs"
                                  onClick={() => handleShowEditModal(task)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="failure"
                                  size="xs"
                                  onClick={() =>
                                    handleShowDeleteModal(task._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              No tasks available.
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal show={showViewModal} onClose={cancelShowViewModal}>
        <Modal.Header>View Task</Modal.Header>
        <Modal.Body>
          <div>
            <h2 className="text-lg font-semibold mb-2">{showViewData.title}</h2>
            <p className="text-sm mb-4">{showViewData.description}</p>
            <p className="text-xs text-right text-gray-500">
              Created at: {formatDate(showViewData.createdAt)}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button className="bg-slate-500" onClick={cancelShowViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onClose={cancelShowEditModal}>
        <Modal.Header>Edit Task</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mb-2"
            />
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mb-2"
            />
            <Label htmlFor="status" value="Status" />
            <Select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mb-2"
            >
              <option value="Todo">Todo</option>
              <option value="InProgress">InProgress</option>
              <option value="Done">Done</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={cancelShowEditModal}>
            Cancel
          </Button>
          <Button color="warning" onClick={editTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={cancelShowDeleteModal}>
        <Modal.Header>Delete Task</Modal.Header>
        <Modal.Body>
          <div className="flex items-center gap-2">
            <HiOutlineExclamationCircle className="text-red-600 text-2xl" />
            <span>Are you sure you want to delete this task?</span>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={cancelShowDeleteModal}>Cancel</Button>
          <Button color="failure" onClick={deleteTask}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
