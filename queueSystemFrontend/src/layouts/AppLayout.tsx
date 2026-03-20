import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

type ContentWidth = 'contained' | 'full';

type AppLayoutProps = {
  showHeader?: boolean;
  contentWidth?: ContentWidth;
};

const navLinkBaseClassName =
  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

function getNavLinkClassName(isActive: boolean): string {
  if (isActive) return `${navLinkBaseClassName} bg-white/15 text-white`;
  return `${navLinkBaseClassName} text-white/75 hover:bg-white/10 hover:text-white`;
}

export function AppLayout({
  showHeader = true,
  contentWidth = 'contained',
}: AppLayoutProps) {
  const location = useLocation();
  const mainClassName =
    contentWidth === 'full'
      ? 'mx-auto w-full p-4 sm:p-6'
      : 'mx-auto max-w-6xl px-4 py-8 sm:px-6';

  const showDeskBreadcrumbs =
    showHeader && location.pathname.startsWith('/desk');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_10%_10%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(800px_circle_at_90%_30%,rgba(168,85,247,0.16),transparent_55%),radial-gradient(700px_circle_at_30%_95%,rgba(34,197,94,0.14),transparent_55%)]" />

      {showHeader && (
        <header className="border-b border-white/10 bg-white/3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link
              to="/"
              aria-label="Ir al inicio"
              className="flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-sky-400/25 to-fuchsia-400/25 ring-1 ring-white/10">
                <span className="text-sm font-semibold tracking-wide">TQ</span>
              </div>
              <div className="leading-tight">
                <div className="text-base font-semibold">Ticket Queue</div>
                <div className="text-xs text-white/60">
                  Sistema de turnos: kiosco, visor y escritorio
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              <NavLink
                to="/kiosk"
                className={({ isActive }) => getNavLinkClassName(isActive)}
              >
                Solicitar
              </NavLink>
              <NavLink
                to="/board"
                className={({ isActive }) => getNavLinkClassName(isActive)}
              >
                Visor
              </NavLink>
              <NavLink
                to="/desk"
                className={({ isActive }) => getNavLinkClassName(isActive)}
              >
                Escritorio
              </NavLink>
            </nav>
          </div>
        </header>
      )}

      <main className={mainClassName}>
        {showDeskBreadcrumbs && (
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-2 text-sm text-white/60"
          >
            {location.pathname === '/desk' ? (
              <>
                <Link
                  to="/desk/select"
                  className="text-white/70 hover:text-white"
                >
                  Seleccionar escritorio
                </Link>
                <span aria-hidden="true" className="text-white/30">
                  /
                </span>
                <span className="font-semibold text-sky-200">Escritorio</span>
              </>
            ) : (
              <span className="font-semibold text-sky-200">
                Seleccionar escritorio
              </span>
            )}
          </nav>
        )}
        <Outlet />
      </main>
    </div>
  );
}
