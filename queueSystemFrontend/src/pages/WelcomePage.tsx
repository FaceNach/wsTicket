import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { Panel } from '../components/Panel';

type MenuBadgeType = 'kiosk' | 'board' | 'desk';

type MenuBadgeStyle = {
  label: string;
  className: string;
  buttonClassName: string;
  icon: React.ReactNode;
};

function getMenuBadgeStyle(type: MenuBadgeType): MenuBadgeStyle {
  switch (type) {
    case 'kiosk':
      return {
        label: 'Kiosk',
        className: 'bg-emerald-400/10 text-emerald-200 ring-emerald-300/20',
        buttonClassName:
          '!rounded-full !bg-none !bg-emerald-400/12 !text-emerald-100 !ring-emerald-300/25 hover:!bg-emerald-400/18',
        icon: (
          <svg
            aria-hidden="true"
            viewBox="-1 -1 26 26"
            className="h-4 w-4 overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7Z" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M8 21h8" />
          </svg>
        ),
      };
    case 'board':
      return {
        label: 'Board',
        className: 'bg-sky-400/10 text-sky-200 ring-sky-300/20',
        buttonClassName:
          '!rounded-full !bg-none !bg-sky-400/12 !text-sky-100 !ring-sky-300/25 hover:!bg-sky-400/18',
        icon: (
          <svg
            aria-hidden="true"
            viewBox="-1 -1 26 26"
            className="h-4 w-4 overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
        ),
      };
    case 'desk':
      return {
        label: 'Desk',
        className: 'bg-fuchsia-400/10 text-fuchsia-200 ring-fuchsia-300/20',
        buttonClassName:
          '!rounded-full !bg-none !bg-fuchsia-400/12 !text-fuchsia-100 !ring-fuchsia-300/25 hover:!bg-fuchsia-400/18',
        icon: (
          <svg
            aria-hidden="true"
            viewBox="-1 -1 26 26"
            className="h-4 w-4 overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h16" />
            <path d="M6 10v10" />
            <path d="M18 10v10" />
            <path d="M9 10V8a3 3 0 0 1 6 0v2" />
          </svg>
        ),
      };
  }
}

function MenuBadge({ type }: { type: MenuBadgeType }) {
  const { label, className, icon } = getMenuBadgeStyle(type);

  return (
    <div
      className={[
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1',
        className,
      ].join(' ')}
    >
      {icon}
      {label}
    </div>
  );
}

type MenuCardProps = {
  title: string;
  description: string;
  to: string;
  actionLabel: string;
  badge: MenuBadgeType;
};

function MenuCard({
  title,
  description,
  to,
  actionLabel,
  badge,
}: MenuCardProps) {
  const { buttonClassName } = getMenuBadgeStyle(badge);

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <MenuBadge type={badge} />
          <div className="mt-3 text-lg font-semibold tracking-tight">
            {title}
          </div>
          <div className="mt-2 text-sm text-white/65">{description}</div>
        </div>
      </div>

      <div className="mt-5">
        <Link to={to}>
          <Button
            type="button"
            className={['w-full', buttonClassName].join(' ')}
          >
            {actionLabel}
          </Button>
        </Link>
      </div>
    </Panel>
  );
}

export function WelcomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Menú"
        description="Elige una pantalla. Esto es solo UI: el visor muestra el ticket actual en grande y los últimos 8 atendidos."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MenuCard
          badge="kiosk"
          title="Solicitar ticket"
          description="Pantalla para el usuario. Solo un botón grande y obvio."
          to="/kiosk"
          actionLabel="Ir a solicitar"
        />
        <MenuCard
          badge="board"
          title="Visor de turnos"
          description="Pantalla para TV/monitor (sin navbar). Ticket actual en grande + últimos 8."
          to="/board"
          actionLabel="Abrir visor"
        />
        <MenuCard
          badge="desk"
          title="Escritorio de atención"
          description="Pantalla para el operador: selecciona escritorio, toma el siguiente ticket y finaliza atención."
          to="/desk/select"
          actionLabel="Seleccionar escritorio"
        />
      </div>

      <Panel
        title="Tip"
        description="Sugerencias para usar el visor en un monitor."
      >
        <ul className="space-y-2 text-sm text-white/70">
          <li>
            - Usa el navegador en pantalla completa (F11) para que el visor
            aproveche todo el espacio.
          </li>
          <li>
            - El visor ya está configurado sin header/nav para minimizar
            distracciones.
          </li>
        </ul>
      </Panel>
    </div>
  );
}
