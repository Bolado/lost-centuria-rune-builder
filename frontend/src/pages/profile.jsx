import { Link, useLoaderData } from "react-router-dom";
import { deserializeBuildState } from "../utils/serializer";

const Profile = () => {
  const builds = useLoaderData();
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="cinzel text-4xl text-center my-8">Your Builds</h2>
      <ul>
        <BuildsList builds={builds} />
      </ul>
    </div>
  );
};

const BuildsList = ({ builds }) => {
  return builds.map((build, i) => {
    // deserialize the build object
    const b = deserializeBuildState(build.build);
    return (
      <li
        className={`p-2 m-2 hover:bg-slate-500/30 rounded-md bg-slate-500/10 `}
        key={build._id}
      >
        <Link to={`/build/${build._id}`}>
          <h3 className="cinzel text-xl font-bold mr-4 ">{b.name}</h3>
          <h3 className="text-md mr-4">Monster: {b.monster.name}</h3>
        </Link>
      </li>
    );
  });
};

export default Profile;
