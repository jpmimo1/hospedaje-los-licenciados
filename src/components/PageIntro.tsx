import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { presentationSpacing } from "@/lib/presentation-spacing";

type PageIntroProps = {
  title: ReactNode;
  description?: string;
  note?: ReactNode;
};

export function PageIntro({ title, description, note }: PageIntroProps) {
  return (
    <header className={presentationSpacing.pageIntro}>
      <Container width="narrow" className="text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            {description}
          </p>
        )}
        {note && (
          <div className="text-muted-foreground text-sm leading-relaxed mt-3">
            {note}
          </div>
        )}
      </Container>
    </header>
  );
}
