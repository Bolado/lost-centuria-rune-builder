import React from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";

const GlobalHeaderAndFooter = () => {
  // get loader data from the router
  const logged = useLoaderData();
  return (
    <>
      <header className="flex justify-between items-center p-3 bg-slate-500/10">
        <a href="/">
          <h1 className="cinzel text-xl text-bold">
            SW:Lost Centuria Rune Builder
          </h1>
        </a>
        {logged ? (
          <Link to="/profile">
            <ProfileButton />
          </Link>
        ) : (
          <Link to="/login">
            <DiscordButton />
          </Link>
        )}
      </header>
      <Outlet />
      <GlobalFooter />
    </>
  );
};

export default GlobalHeaderAndFooter;

// discord button
const DiscordButton = () => {
  return (
    <button class="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <svg
        class="h-6 w-6 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        width="800px"
        height="800px"
        viewBox="0 -28.5 256 256"
        version="1.1"
        preserveAspectRatio="xMidYMid"
      >
        <g>
          <path
            d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
            fill="#5865F2"
            fill-rule="nonzero"
          ></path>
        </g>
      </svg>

      <span>Login with Discord</span>
    </button>
  );
};

// profile button (only visible when logged in)
const ProfileButton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="2rem"
      viewBox="0 -960 960 960"
      width="2rem"
      fill="#e8eaed"
      className="hover:fill-blue-500"
    >
      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
    </svg>
  );
};

const GlobalFooter = () => {
  return (
    <footer className="p-3 bg-slate-500/10">
      <p className="text-center text-sm text-gray-500">
        Made with ❤️ by{" "}
        <a href="https://github.com/bolado" className="text-blue-500">
          bolado
        </a>{" "}
        -{" "}
        <a href="buymeacoffee.com/bolado" className="text-blue-500">
          Buy me a coffee ☕
        </a>
      </p>
    </footer>
  );
};
