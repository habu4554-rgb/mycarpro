import { createFileRoute } from "@tanstack/react-router";
import { HomePage, localizedHead } from "./index";

export const Route = createFileRoute("/ru")({
  component: () => <HomePage initialLang="ru" />,
  head: () => localizedHead("ru"),
});
