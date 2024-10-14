import TicketForm from "@/components/TicketForm";
import { getServerSession } from "next-auth/next";  
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const getTicketById = async (id) => {
  const res = await fetch(`http://localhost:3000/api/ticket/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get Ticket.");
  }
  return res.json();
};

const TicketPage = async ({ params }) => {
  const session = await getServerSession(authOptions); // Obtiene la sesión
  console.log(session)
  if (!session) {
    // Si no hay sesión, puedes redirigir o mostrar un mensaje
    return <p>Debes iniciar sesión para editar o crear un ticket.</p>;
  }

  const EDITMODE = params.id === "new" ? false : true;

  let updateTicketData = {};

  if (EDITMODE) {
    updateTicketData = await getTicketById(params.id);
    updateTicketData = updateTicketData.foundTicket;
  } else {
    updateTicketData = { _id: "new" };
  }

  return <TicketForm ticket={updateTicketData} />;
};

export default TicketPage;
