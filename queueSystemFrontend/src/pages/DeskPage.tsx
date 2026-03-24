import { useNavigate } from "react-router-dom";
import { BigTicket } from "../components/BigTicket";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { TicketCard } from "../components/TicketCard";
import type { Ticket } from "../types/ticket";
import { useParams } from "react-router";
import { useSocketTicket } from "../hooks/useSocketTickets";
import { useCallback, useEffect, useState } from "react";
import type { ServerMessage } from "../types/socket.types";

export function DeskPage() {
  const navigate = useNavigate();

  const { deskNumber } = useParams();
  const { subscribeToMessages, getQueueState, requestNextTicket } =
    useSocketTicket();

  const [currentServing, setCurrentServing] = useState<Ticket | undefined>();
  const [lastServedForDesk, setLastServedForDesk] = useState<Ticket[]>([]);

  const isServing = Boolean(currentServing);
  const [queueCount, setQueueCount] = useState(0);
  const hasQueue = queueCount > 0;

  const handleResponse = useCallback((response: ServerMessage) => {
    switch (response.type) {
      case "QUEUE_STATE":
        console.log(response.payload.state.pendingTotal.combined);
        setQueueCount(response.payload.state.pendingTotal.combined);
        break;
      case "NEXT_TICKET_ASSIGNED":
        setCurrentServing(response.payload.ticket);
        if (response.payload.ticket) {
          setLastServedForDesk((prev) => [response.payload.ticket!, ...prev]);
        }
        break;

      case "QUEUE_EMPTY":
        alert("No hay tickets en cola");
    }
  }, []);

  useEffect(() => {
    return subscribeToMessages(handleResponse);
  }, [subscribeToMessages, handleResponse]);

  useEffect(() => {
    if (queueCount === 0) {
      getQueueState();
    }
  }, [queueCount, getQueueState]);

  function handleChangeDesk() {
    navigate("/desk/select");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escritorio de atención"
        description="Pantalla del operador: toma el siguiente ticket, atiende y finaliza."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Panel
            title="Control"
            description="Componentes típicos del operador."
            footer={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => requestNextTicket(+deskNumber!, false)}
                >
                  Tomar siguiente ticket
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-amber-800/25 text-amber-800"
                  onClick={() => requestNextTicket(+deskNumber!, true)}
                >
                  Forzar normal
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled
                >
                  Finalizar atención
                </Button>
              </div>
            }
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/3 p-4 ring-1 ring-white/10">
              <div>
                <div className="text-xs font-semibold tracking-wide text-white/60">
                  Escritorio
                </div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                  #{deskNumber}
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleChangeDesk}
              >
                Cambiar
              </Button>
            </div>

            <div className="mt-5 rounded-2xl bg-white/3 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Estado</div>
              <div className="mt-1 text-sm text-white/75">
                {isServing
                  ? "Atendiendo ahora."
                  : hasQueue
                    ? "Listo para tomar el siguiente ticket."
                    : "No hay tickets en la cola."}
              </div>
              <div className="mt-3 text-xs text-white/60">
                En cola:{" "}
                <span className="font-semibold text-white/80">
                  {queueCount}
                </span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <BigTicket ticket={currentServing ?? null} />

          <Panel
            title="Últimos atendidos en este escritorio"
            description="Máximo 8 para lectura rápida."
          >
            {lastServedForDesk.length === 0 ? (
              <div className="rounded-2xl bg-white/3 p-4 text-sm text-white/65 ring-1 ring-white/10">
                No hay tickets recientes para este escritorio.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {lastServedForDesk.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
