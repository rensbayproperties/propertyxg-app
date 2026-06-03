import Container from "./Container";
import { cn } from "@/lib/utils";

export default function SectionContainer({ children, ...props }) {
  const spacingClass = cn({
    "py-10": true,
    "md:py-16": props.variant && props.variant === "y-lg",
  });

  return (
    <div
      className={`${spacingClass} ${
        (props.extraClassName && props.extraClassName) || ""
      }`}
    >
      <Container variant={props.containerVariant}>{children}</Container>
    </div>
  );
}
