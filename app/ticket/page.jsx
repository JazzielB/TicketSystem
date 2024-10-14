import TicketCard from "@/components/TicketCard";
import { getServerSession } from "next-auth/next";  // Importa getServerSession
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getTickets = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/ticket", {
      cache: "no-store",  // no cache to ensure fresh data
    });
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return await res.json();
  } catch (error) {
    console.error("Failed to get tickets", error);
    return { tickets: [] };  // Return an empty array to avoid breaking the UI
  }
};

const Dashboard = async () => {
  const session = await getServerSession(authOptions); // Obtiene la sesión

  if (!session) {
    // Si no hay sesión, puedes redirigir o mostrar un mensaje
    return <p>Debes iniciar sesión para ver el dashboard.</p>;
  }

  const { tickets } = await getTickets();

  const uniqueCategories = [
    ...new Set(tickets?.map(({ category }) => category)),
  ];

  return (
    <div className="p-5">
      {tickets && uniqueCategories.length > 0 ? (
        uniqueCategories.map((uniqueCategory, categoryIndex) => (
          <div key={categoryIndex} className="mb-4">
            <h2>{uniqueCategory}</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tickets
                .filter((ticket) => ticket.category === uniqueCategory)
                .map((filteredTicket) => (
                  <TicketCard
                    id={filteredTicket._id}  // Use ticket ID here
                    key={filteredTicket._id}  // Unique key for each ticket
                    ticket={filteredTicket}
                  />
                ))}
            </div>
          </div>
        ))
      ) : (
        <p>No tickets available</p>  // Handle case when no tickets are returned
      )}
    </div>
  );
};

export default Dashboard;
