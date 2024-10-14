import DeleteBlock from "./DeleteBlock";
import PriorityDisplay from "./PriorityDisplay";
import ProgressBar from "./ProgressBar";
import StatusDisplay from "./StatusDisplay";
import Link from "next/link";

const TicketCard = ({ ticket }) => {
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

  return (
    <div className="flex flex-col bg-card hover:bg-card-hover rounded-md shadow-lg p-3 m-2">
      <div className="flex mb-3 justify-between items-center">
        <PriorityDisplay priority={ticket.priority} />
        <div className="flex items-center">
          <StatusDisplay status={ticket.status} />
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
        <ProgressBar progress={ticket.progress} />
      </Link>
      <div className="flex justify-between mt-2">
        <p className="text-xs my-1 font-bold text-blue-600 bg-gray-100 p-1 rounded">
          {ticket.user}
        </p>
        <p className="text-xs my-1 text-right">
          {formatTimestamp(ticket.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default TicketCard;
