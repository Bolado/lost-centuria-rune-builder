import { Link } from "react-router-dom";
import ButtonPrimary from "../components/button-primary";

function Callback() {
  return (
    <div className="flex items-center	justify-center flex-col gap-4 min-h-[100vh]">
      <h1 className="cinzel text-center text-6xl">
        You have been logged in successfully!
      </h1>

      <Link to={"/build/new"}>
        <ButtonPrimary>Start building!</ButtonPrimary>
      </Link>
    </div>
  );
}

export default Callback;
