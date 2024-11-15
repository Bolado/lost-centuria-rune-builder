import { Link, useLoaderData } from "react-router-dom";

const Profile = () => {
  const builds = useLoaderData();
  return (
    <div>
      <h2>Your Builds</h2>
      <ul>
        {builds.map((build) => (
          <li key={build._id}>
            <Link to={`/build/${build._id}`}>{build.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
