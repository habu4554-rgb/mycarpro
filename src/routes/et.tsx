import { createFileRoute } from "@tanstack/react-router";
import { HomePage, localizedHead } from "./index";

export const Route = createFileRoute("/et")({
  component: () => <HomePage initialLang="et" />,
  head: () => localizedHead("et"),
});
