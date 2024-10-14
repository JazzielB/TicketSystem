"use client";

import DeleteBlock from "./DeleteBlock";
import PriorityDisplay from "./PriorityDisplay";
import ProgressBar from "./ProgressBar";
import StatusDisplay from "./StatusDisplay";
import Link from "next/link";
import { useState } from "react";

const TicketCard = ({ ticket }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolveComment, setResolveComment] = useState("");
  const [comments, setComments] = useState(ticket.comments || []);
  const [status, setStatus] = useState(ticket.status); // Estado local para el status
  const [progress, setProgress] = useState(ticket.progress); // Estado local para el progreso
  const [error, setError] = useState("");

  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  };

  const handleAddComment = async () => {
    if (!resolveComment) return;

    try {
      const res = await fetch(`/api/ticket/${ticket._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: resolveComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments([...comments, resolveComment]);
        setResolveComment("");
        setStatus("Started"); // Actualiza el estado local
        setProgress(50); // Actualiza el progreso localmente
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error al agregar comentario");
    }
  };

  const handleResolveAndClose = async () => {
    if (!resolveComment) return;

    try {
      const res = await fetch(`/api/ticket/${ticket._id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: resolveComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments([...comments, resolveComment]);
        setResolveComment("");
        setStatus("Done"); // Actualiza el estado local
        setProgress(100); // Opcional: actualiza el progreso a 100 si se resuelve
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      setError("Error al resolver el ticket");
    }
  };

  return (
    <div className="flex flex-col bg-card hover:bg-card-hover rounded-md shadow-lg p-3 m-2">
      <div className="flex mb-3 justify-between items-center">
        <PriorityDisplay priority={ticket.priority} />
        <div className="flex items-center">
          <StatusDisplay status={status} /> {/* Usa el estado local */}
          <div className="ml-2">
            <DeleteBlock id={ticket._id} />
          </div>
        </div>
      </div>
      <Link href={`/ticket/${ticket._id}`} style={{ display: "contents" }}>
        <h4>{ticket.title}</h4>
        <hr className="h-px border-0 bg-page mb-2" />
        <p className="whitespace-pre-wrap">{ticket.description}</p>
        <div className="flex-grow"></div>
        <ProgressBar progress={progress} /> {/* Usa el progreso local */}
      </Link>
      <div className="flex justify-between mt-2">
        <p className="text-xs my-1 font-bold text-blue-600 bg-gray-100 p-1 rounded">
          {ticket.user}
        </p>
        <p className="text-xs my-1 text-right">
          {formatTimestamp(ticket.createdAt)}
        </p>
      </div>
      <div className="mt-3">
        <h5>Comentarios:</h5>
        <ul>
          {comments.map((comment, index) => (
            <li key={index} className="text-sm text-gray-700 bg-gray-100 p-1 rounded mb-1">
              {comment}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-2 bg-yellow-500 text-white p-1 rounded"
        >
          Agregar Comentario / Resolver
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-2">Agregar Comentario o Resolver Ticket</h3>
            <textarea
              value={resolveComment}
              onChange={(e) => setResolveComment(e.target.value)}
              placeholder="Add a comment or resolution"
              className="border p-2 rounded w-full mt-2"
              rows="4"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white p-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white p-2 rounded mr-2"
              >
                Agregar Comentario
              </button>
              <button
                onClick={handleResolveAndClose}
                className="bg-green-500 text-white p-2 rounded"
              >
                Resolver y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;