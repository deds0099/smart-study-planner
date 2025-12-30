import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DayData {
  name: string;
  shortName: string;
  blocks: number;
  completed: number;
  isToday: boolean;
}

const weekDays: DayData[] = [
  { name: 'Segunda', shortName: 'Seg', blocks: 4, completed: 4, isToday: false },
  { name: 'Terça', shortName: 'Ter', blocks: 4, completed: 4, isToday: false },
  { name: 'Quarta', shortName: 'Qua', blocks: 3, completed: 3, isToday: false },
  { name: 'Quinta', shortName: 'Qui', blocks: 4, completed: 1, isToday: true },
  { name: 'Sexta', shortName: 'Sex', blocks: 4, completed: 0, isToday: false },
  { name: 'Sábado', shortName: 'Sáb', blocks: 2, completed: 0, isToday: false },
  { name: 'Domingo', shortName: 'Dom', blocks: 0, completed: 0, isToday: false },
];

export function WeeklyView() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Esta Semana</h2>
        <span className="text-sm text-muted-foreground">Semana 12 • Ciclo 3</span>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const percentage = day.blocks > 0 ? (day.completed / day.blocks) * 100 : 0;
            const isComplete = percentage === 100;
            const isRest = day.blocks === 0;

            return (
              <div
                key={day.shortName}
                className={cn(
                  'flex flex-col items-center p-3 rounded-lg transition-all duration-200',
                  day.isToday && 'ring-2 ring-primary ring-offset-2',
                  isComplete && 'bg-success/10',
                  isRest && 'bg-muted/50'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium mb-2',
                    day.isToday ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {day.shortName}
                </span>

                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    isRest && 'bg-muted text-muted-foreground',
                    isComplete && 'gradient-success text-success-foreground',
                    !isRest && !isComplete && percentage > 0 && 'bg-primary/20 text-primary',
                    !isRest && !isComplete && percentage === 0 && 'bg-secondary text-muted-foreground'
                  )}
                >
                  {isRest ? '😴' : isComplete ? '✓' : `${day.completed}`}
                </div>

                {!isRest && (
                  <span className="text-xs text-muted-foreground mt-1">
                    /{day.blocks}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso semanal</span>
            <span className="font-semibold text-foreground">12/21 blocos (57%)</span>
          </div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: '57%' }}
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
