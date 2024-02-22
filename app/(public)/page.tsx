import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex grow items-center justify-center text-center h-full">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center px-6 py-8 lg:py-0">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          Join the Event <br /> Planning Revolution.
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
          We are working hard to provide you with a curated experience to
          modernize event planning. Click the button below to join us and get
          started.
        </p>
        <Link className="w-full" href="/register">
          <Button
            className="mx-auto w-full max-w-md flex items-center space-x-2"
            hx-post="/partials/wait-list"
            hx-swap="outerHTML"
            data-astro-reload
          >
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
