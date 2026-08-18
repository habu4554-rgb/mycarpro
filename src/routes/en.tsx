import { createFileRoute } from "@tanstack/react-router";
import { HomePage, localizedHead } from "./index";

export const Route = createFileRoute("/en")({
  component: () => <HomePage initialLang="en" />,
  head: () => localizedHead("en"),
});
