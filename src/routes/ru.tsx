import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ru")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
