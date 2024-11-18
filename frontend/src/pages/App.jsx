import { Link } from "react-router-dom";
import ButtonPrimary from "../components/button-primary";

function App() {
  return (
    <div className="flex items-center	justify-center flex-col gap-4 min-h-[calc(100vh-theme(spacing.24))]">
      <video
        className="max-w-[2560px] h-screen fixed left-1/2 top-0 -translate-x-1/2 object-cover -z-10"
        src="https://hive-fn.qpyou.cn/webdev/smon/20231103_124021_SX6QW4yK1o.mp4"
        muted
        playsInline
        autoPlay
        loop
      />
      <img
        src={`https://cdn.streamelements.com/infinity/summoners/logo_lost_centuria.png`}
        className="max-w-[50vh] h-auto"
        alt="logo"
      />
      <h1 className="cinzel text-4xl text-center">
        Welcome to the Lost Centuria Rune Builder!
      </h1>

      <Link to={"build/new"}>
        <ButtonPrimary>Create new!</ButtonPrimary>
      </Link>
    </div>
  );
}

export default App;
