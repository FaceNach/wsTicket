import type { ReactNode } from 'react';

type PanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Panel({ title, description, children, footer }: PanelProps) {
  return (
    <section className="rounded-3xl bg-white/4 p-5 ring-1 ring-white/10 backdrop-blur sm:p-6">
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-white/60">{description}</p>
          )}
        </header>
      )}

      <div>{children}</div>

      {footer && (
        <footer className="mt-5 border-t border-white/10 pt-4">{footer}</footer>
      )}
    </section>
  );
}
