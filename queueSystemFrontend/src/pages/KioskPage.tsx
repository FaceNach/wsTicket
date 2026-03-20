import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Ticket } from '../types/ticket';
import { formatTicketLabel } from '../utils/tickets';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { PersonIcon } from '../icons/PersonIcon';
import { PregnantIcon } from '../icons/PregnantIcon';
import { WheelChairIcon } from '../icons/WheelChairIcon';
import { ElderlyCoupleIcon } from '../icons/ElderlyCoupleIcon';

type TicketRequestVariant = 'normal' | 'preferential';

type TicketAssignedModalProps = {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
};

type TicketRequestButtonProps = {
  title: string;
  subtitle: string;
  hint: string;
  variant: TicketRequestVariant;
  icons?: ReactNode;
  onClick: () => void;
};

function TicketRequestButton({
  title,
  subtitle,
  hint,
  variant,
  icons,
  onClick,
}: TicketRequestButtonProps) {
  const stylesByVariant: Record<TicketRequestVariant, string> = {
    normal:
      'bg-linear-to-b from-emerald-400/25 to-emerald-400/10 ring-emerald-300/25 hover:from-emerald-400/30 hover:to-emerald-400/15',
    preferential:
      'bg-linear-to-b from-amber-400/25 to-amber-400/10 ring-amber-300/25 hover:from-amber-400/30 hover:to-amber-400/15',
  };

  const glowByVariant: Record<
    TicketRequestVariant,
    { topRight: string; bottomLeft: string }
  > = {
    normal: { topRight: 'bg-emerald-400/10', bottomLeft: 'bg-sky-400/10' },
    preferential: {
      topRight: 'bg-amber-400/10',
      bottomLeft: 'bg-violet-400/10',
    },
  };

  const styles = stylesByVariant[variant];
  const glow = glowByVariant[variant];

  return (
    <button
      type="button"
      className={[
        'group relative w-full overflow-hidden rounded-4xl px-10 py-10 text-center ring-1 transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
        styles,
      ].join(' ')}
      onClick={onClick}
    >
      <div
        className={[
          'absolute -right-16 -top-16 size-72 rounded-full blur-3xl transition group-hover:opacity-100',
          glow.topRight,
        ].join(' ')}
      />
      <div
        className={[
          'absolute -bottom-16 -left-16 size-72 rounded-full blur-3xl transition group-hover:opacity-100',
          glow.bottomLeft,
        ].join(' ')}
      />

      <div className="relative">
        {icons ? (
          <div className="mb-5 flex justify-center">
            <div className="flex items-center justify-center gap-4 rounded-full bg-white/10 px-6 py-3 text-5xl text-white ring-1 ring-white/15 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
              {icons}
            </div>
          </div>
        ) : null}
        <div className="text-base font-semibold tracking-wide text-white/80">
          {title}
        </div>
        <div className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {subtitle}
        </div>
        <div className="mt-4 text-sm text-white/65">{hint}</div>
      </div>
    </button>
  );
}

function TicketAssignedModal({
  isOpen,
  ticket,
  onClose,
}: TicketAssignedModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm "
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <Panel
          title="Ticket asignado"
          description="Guarda este número. Cuando te llamen, acércate al escritorio."
          footer={
            <div className="flex justify-end gap-3">
              <Button
                ref={closeButtonRef}
                type="button"
                variant="primary"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </div>
          }
        >
          <div className="mt-2 text-center">
            <div className="text-xs font-semibold tracking-wide text-white/60">
              Tu turno
            </div>
            <div className="mt-3 text-6xl font-semibold tracking-tight sm:text-7xl">
              {ticket ? formatTicketLabel(ticket) : '—'}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function KioskPage() {
  const [assignedTicket, setAssignedTicket] = useState<Ticket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const previewTicketsByVariant: Record<TicketRequestVariant, Ticket> = {
    normal: {
      id: 'preview-queue-normal',
      prefix: 'A',
      number: 12,
      deskNumber: 0,
      createdAt: new Date(),
      servedAt: null,
    },
    preferential: {
      id: 'preview-queue-preferential',
      prefix: 'P',
      number: 3,
      deskNumber: 0,
      createdAt: new Date(),
      servedAt: null,
    },
  };

  function closeTicketModal() {
    setIsTicketModalOpen(false);
  }

  function handleRequestTicket(variant: TicketRequestVariant) {
    setAssignedTicket(previewTicketsByVariant[variant]);
    setIsTicketModalOpen(true);
  }

  function handleRequestNormalTicket() {
    handleRequestTicket('normal');
  }

  function handleRequestPreferentialTicket() {
    handleRequestTicket('preferential');
  }

  return (
    <div className="grid min-h-[80vh] place-items-center">
      {/* Modal de ticket asignado */}
      <TicketAssignedModal
        isOpen={isTicketModalOpen}
        ticket={assignedTicket}
        onClose={closeTicketModal}
      />

      {/* Contenido principal */}
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <div className="text-sm font-semibold tracking-wide text-white/60">
            Dispensador
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Presiona para obtener tu turno
          </h1>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <TicketRequestButton
            variant="normal"
            title="Gestión general"
            subtitle="Ticket general"
            hint="(Se agrega a la cola general)"
            icons={<PersonIcon className="size-[1em]" />}
            onClick={handleRequestNormalTicket}
          />
          <TicketRequestButton
            variant="preferential"
            title="Gestión preferencial"
            subtitle="Solicitar ticket"
            hint="(Embarazadas, tercera edad y discapacidad)"
            icons={
              <>
                <PregnantIcon className="size-[1em]" />
                <WheelChairIcon className="size-[1em]" />
                <ElderlyCoupleIcon className="size-[1em]" />
              </>
            }
            onClick={handleRequestPreferentialTicket}
          />
        </div>
      </div>
    </div>
  );
}
