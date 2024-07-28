import React, { useState } from "react";
import { Button, Label, TextInput, Select, Textarea } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import api from "../components/axiosBase";

const AddTaskForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(
        "/api/task/create",
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
        setFormData({ title: "", description: "", status: "" });
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto shadow-lg py-4 px-6 bg-white rounded-lg mt-8">
      <h3 className="text-xl font-bold text-center mb-4">Add New Task</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="block">
          <Label htmlFor="title" value="Task Title" />
          <TextInput
            id="title"
            type="text"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="block">
          <Label htmlFor="description" value="Task Description" />
          <Textarea
            id="description"
            type="text"
            placeholder="Task Description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="block">
          <Label htmlFor="status" value="Task Status" />
          <Select id="status" value={formData.status} onChange={handleChange}>
            <option value="Todo">TODO</option>
            <option value="InProgress">IN PROGRESS</option>
            <option value="Done">DONE</option>
          </Select>
        </div>

        <Button type="submit" disabled={loading}>
          Add Task
        </Button>
      </form>
    </div>
  );
};

export default AddTaskForm;
