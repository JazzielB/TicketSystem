import { faHome, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex justify-between bg-nav p-4">
      <div className="flex items-center space-x-4">
        <Link href="/ticket">
          <FontAwesomeIcon icon={faHome} className="icon" />
        </Link>
        <Link href="/ticket/new">
          <FontAwesomeIcon icon={faTicket} className="icon" />
        </Link>
      </div>
      <div>
        <Link href="/">
          <p className="text-default-text">Login</p>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;