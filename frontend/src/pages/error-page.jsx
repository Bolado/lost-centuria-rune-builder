import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="min-h-[100vh] flex justify-center items-center flex-col gap-6"
    >
      <h1 className="text-4xl">Oops!</h1>
      <p className="text-xl">Sorry, an unexpected error has occurred.</p>
      <p className="text-lg">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
