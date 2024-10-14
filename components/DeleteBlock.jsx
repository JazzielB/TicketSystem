"use client";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

const DeleteBlock = ({ id }) => {
  const router = useRouter();

  const deleteTicket = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/ticket/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        console.error("Failed to delete ticket:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred while deleting the ticket:", error);
    }
  };
  

  return (
    <FontAwesomeIcon
      icon={faX}
      className="text-red-100 hover:cursor-pointer hover:text-red-200"
      onClick={deleteTicket}
    />
  );
};

export default DeleteBlock;
