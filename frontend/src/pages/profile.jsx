import { Link, useLoaderData } from "react-router-dom";
import { deserializeBuildState } from "../utils/serializer";

const Profile = () => {
  const builds = useLoaderData();
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="cinzel text-4xl text-center my-8">Your Builds</h2>
      <ul className="flex flex-wrap justify-center">
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
        className={`p-4 m-2 hover:bg-slate-500/30 rounded-md bg-slate-500/10`}
        key={build._id}
      >
        <Link to={`/build/${build._id}`} className="flex flex-row gap-2">
          <div>
            <img
              src={b.monster.icon}
              alt={b.monster.name}
              className="w-20 rounded-md"
            />
          </div>
          <div className="flex justify-between flex-col">
            <div>
              <h3 className="cinzel text-xl font-bold">{b.name}</h3>
              <h3 className="text-md">Monster: {b.monster.name}</h3>
            </div>
            <div>
              <h3 className="text-md">
                Last Updated: {new Date(build.timestamp).toLocaleString()}
              </h3>
            </div>
          </div>
        </Link>
      </li>
    );
  });
};

export default Profile;
