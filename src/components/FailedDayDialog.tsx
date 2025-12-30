import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FailedDayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReorganize: () => void;
  pendingBlocks: number;
}

export function FailedDayDialog({ isOpen, onClose, onReorganize, pendingBlocks }: FailedDayDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in p-4">
      <Card className="w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-warning/10">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Não foi hoje?</h3>
              <p className="text-sm text-muted-foreground">Sem problemas, acontece!</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">
          Você tem <span className="font-semibold text-foreground">{pendingBlocks} blocos</span> pendentes.
          Posso reorganizar seu cronograma para distribuir esses estudos nos próximos dias.
        </p>

        <div className="space-y-3">
          <Button className="w-full gradient-primary text-primary-foreground" onClick={onReorganize}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reorganizar cronograma
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Manter como está
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          💡 Dica: Estudar um pouco é melhor que não estudar nada!
        </p>
      </Card>
    </div>
  );
}
