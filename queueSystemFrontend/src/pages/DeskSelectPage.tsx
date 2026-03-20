import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { Panel } from '../components/Panel';
import { getDeskBadgeClassName } from '../utils/badge-class';

const deskOptions = [1, 2, 3, 4, 5, 6];

export function DeskSelectPage() {
  const navigate = useNavigate();
  const [deskNumber, setDeskNumber] = useState<number | null>(null);

  function handleContinue() {
    if (deskNumber == null) return;
    navigate('/desk');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seleccionar escritorio"
        description="Elige el escritorio donde vas a atender. (Solo UI, no se guarda en el dispositivo)."
      />

      <Panel
        title="¿En qué escritorio vas a atender?"
        description="Selección visual para el layout. No hay persistencia ni lógica de negocio."
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/60">
              Selecciona un escritorio y continúa.
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleContinue}
                disabled={deskNumber == null}
              >
                Continuar
              </Button>
            </div>
          </div>
        }
      >
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/80">
            Escritorios disponibles
          </legend>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {deskOptions.map((optionDeskNumber) => {
              const isSelected = optionDeskNumber === deskNumber;

              return (
                <label
                  key={optionDeskNumber}
                  className={[
                    'group flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-4 ring-1 transition',
                    getDeskBadgeClassName(optionDeskNumber),
                    isSelected
                      ? 'ring-white/40'
                      : 'ring-white/10 hover:bg-white/10 hover:ring-white/20',
                    'focus-within:ring-2 focus-within:ring-white/60',
                  ].join(' ')}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="deskNumber"
                    value={optionDeskNumber}
                    checked={isSelected}
                    onChange={() => setDeskNumber(optionDeskNumber)}
                  />

                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      Escritorio {optionDeskNumber}
                    </div>
                    <div className="mt-0.5 text-xs text-white/60">
                      Atención al público
                    </div>
                  </div>

                  <div
                    className={[
                      'flex h-6 w-6 items-center justify-center rounded-full ring-1 transition',
                      isSelected
                        ? 'bg-white/15 ring-white/30'
                        : 'bg-white/0 ring-white/15 group-hover:ring-white/25',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    <span
                      className={
                        isSelected
                          ? 'text-sm text-white'
                          : 'text-sm text-white/30'
                      }
                    >
                      ✓
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <p className="text-sm text-white/60">
            Consejo: si este es un dispositivo fijo (kiosco/mostrador), dejarlo
            guardado acelera el inicio.
          </p>
        </fieldset>
      </Panel>
    </div>
  );
}
