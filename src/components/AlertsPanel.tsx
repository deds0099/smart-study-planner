import { X, Bell, RotateCcw, AlertTriangle, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/types/study';
import { cn } from '@/lib/utils';

interface AlertsPanelProps {
  alerts: Alert[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const alertConfig = {
  revision: {
    icon: <RotateCcw className="h-5 w-5" />,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  delay: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  overload: {
    icon: <Zap className="h-5 w-5" />,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  achievement: {
    icon: <Award className="h-5 w-5" />,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

export function AlertsPanel({ alerts, isOpen, onClose, onMarkAsRead }: AlertsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Alertas</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-80px)]">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum alerta no momento</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const config = alertConfig[alert.type];
              return (
                <Card
                  key={alert.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
                    !alert.read && 'ring-1 ring-primary/20'
                  )}
                  onClick={() => onMarkAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg', config.bgColor)}>
                      <span className={config.color}>{config.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm text-foreground', !alert.read && 'font-medium')}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.createdAt).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!alert.read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
