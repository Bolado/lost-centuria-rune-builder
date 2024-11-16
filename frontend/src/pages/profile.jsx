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
            <li key={build._id}>
              <Link to={`/build/${build._id}`}>{b.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Profile;
