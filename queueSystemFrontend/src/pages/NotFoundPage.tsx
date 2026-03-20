import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Panel } from '../components/Panel';

export function NotFoundPage() {
  return (
    <Panel title="Página no encontrada" description="La ruta solicitada no existe.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/70">Vuelve al inicio para continuar.</div>
        <Link to="/">
          <Button type="button">Ir a Solicitar</Button>
        </Link>
      </div>
    </Panel>
  );
}


