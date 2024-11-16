import { Link, useLoaderData } from "react-router-dom";
import { deserializeBuildState } from "../utils/serializer";

const Profile = () => {
  const builds = useLoaderData();
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="cinzel text-4xl text-center my-8">Your Builds</h2>
      <ul>
        {builds.map((build) => {
          // deserialize the build object
          const b = deserializeBuildState(build.build);
          return (
            <li
              className="p-2 m-2 hover:bg-blue-500/30 rounded-md"
              key={build._id}
            >
              <Link to={`/build/${build._id}`}>
                <h3 className="cinzel text-xl font-bold mr-4 ">{b.name}</h3>
                <h3 className="text-md mr-4">Monster: {b.monster.name}</h3>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Profile;
