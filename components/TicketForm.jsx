"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Importa useSession de next-auth

const TicketForm = ({ ticket }) => {
  const router = useRouter();
  const { data: session } = useSession(); // Obtiene la sesión actual
  const userName = session?.user?.name || ""; // Obtiene el nombre del usuario

  const defaultTicket = {
    title: "",
    description: "",
    category: "Hardware Problem",
    priority: 1,
    progress: 0,
    status: "Not Started",
    active: true, // Valor por defecto para active
    user: userName, // Añadir el campo user
  };

  const currentTicket = ticket || defaultTicket;
  const EDITMODE = currentTicket._id !== "new";

  const [formData, setFormData] = useState({
    title: currentTicket.title || "", // Default to empty string
    description: currentTicket.description || "", // Default to empty string
    priority: currentTicket.priority !== undefined ? currentTicket.priority : 1,
    progress: currentTicket.progress !== undefined ? currentTicket.progress : 0,
    status: currentTicket.status || "Not Started",
    category: currentTicket.category || "Hardware Problem",
    active: currentTicket.active !== undefined ? currentTicket.active : true,
    user: currentTicket.user || userName,
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "", 
        description: ticket.description || "",
        priority: ticket.priority !== undefined ? ticket.priority : 1,
        progress: ticket.progress !== undefined ? ticket.progress : 0,
        status: ticket.status || "Not Started",
        category: ticket.category || "Hardware Problem",
        active: ticket.active !== undefined ? ticket.active : true,
        user: ticket.user || userName,
      });
    }
  }, [ticket, userName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : name === "priority" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data being sent:", formData);

    const method = EDITMODE ? "PUT" : "POST";
    const url = EDITMODE ? `/api/ticket/${currentTicket._id}` : "/api/ticket";

    try {
      const res = await fetch(url, {
        method,
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error details:", errorData);
        throw new Error(`Failed to ${EDITMODE ? "update" : "create"} Ticket: ${errorData.message || "Unknown error"}`);
      }

      router.refresh();
      router.push("/ticket"); // Cambia la redirección según sea necesario
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        className="flex flex-col gap-3 w-1/2"
        method="post"
        onSubmit={handleSubmit}
      >
        <h3>{EDITMODE ? "Update your Ticket" : "Create your ticket"}</h3>
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title || ""} // Ensure value is never undefined
        />
        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description || ""} // Ensure value is never undefined
          rows="5"
        />
        <label>Category</label>
        <select
          name="category"
          onChange={handleChange}
          value={formData.category}
        >
          <option value="Hardware Problem">Hardware Problem</option>
          <option value="Software Problem">Software Problem</option>
          <option value="Project Problem">Project Problem</option>
        </select>
        <label>Priority</label>
        <div className="flex flex-col gap-2">
          { [1, 2, 3, 4, 5].map((priority) => (
            <label key={priority} className="flex items-center">
              <input
                id={`priority-${priority}`}
                name="priority"
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority === priority}
                className="mr-2" // Margen derecho para separar el input del label
              />
              {priority}
            </label>
          )) }
        </div>
        <label>Progress</label>
        <input
          type="range"
          id="progress"
          name="progress"
          value={formData.progress}
          min="0"
          max="100"
          onChange={handleChange}
        />
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Not Started">Not Started</option>
          <option value="Started">Started</option>
          <option value="Done">Done</option>
        </select>
        <label>Active</label>
        <input
          id="active"
          name="active"
          type="checkbox"
          onChange={(e) => setFormData((prevState) => ({
            ...prevState,
            active: e.target.checked,
          }))}
          checked={formData.active}
        />
        <input
          type="submit"
          className="btn"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
        />
      </form>
    </div>
  );
};

export default TicketForm;
