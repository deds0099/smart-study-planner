import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StudyBlock, Subject } from '@/types/study';
import { cn } from '@/lib/utils';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: StudyBlock[];
  subjects: Subject[];
  studyDays: number[];
}

export function CalendarModal({ isOpen, onClose, blocks, subjects, studyDays }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isStudyDay = (dayOfWeek: number) => studyDays.includes(dayOfWeek);

  const getBlocksForDate = (day: number) => {
    const date = new Date(year, month, day);
    return blocks.filter((b) => {
      const blockDate = new Date(b.scheduledFor);
      return (
        blockDate.getDate() === day &&
        blockDate.getMonth() === month &&
        blockDate.getFullYear() === year
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen py-8 px-4 flex items-start justify-center">
        <Card
          className="w-full max-w-lg bg-card animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Calendário</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-foreground capitalize">{monthName}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar grid */}
          <div className="p-4 pt-0">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDayNames.map((name, i) => (
                <div
                  key={name}
                  className={cn(
                    'text-center text-xs font-medium py-2',
                    isStudyDay(i) ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayOfWeek = new Date(year, month, day).getDay();
                const isStudy = isStudyDay(dayOfWeek);
                const dayBlocks = getBlocksForDate(day);
                const completedBlocks = dayBlocks.filter((b) => b.status === 'completed').length;
                const hasBlocks = dayBlocks.length > 0;

                return (
                  <div
                    key={day}
                    className={cn(
                      'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative',
                      isToday(day) && 'ring-2 ring-primary ring-offset-2',
                      isStudy ? 'bg-primary/5' : 'bg-muted/30',
                      !isStudy && 'opacity-50'
                    )}
                  >
                    <span className={cn('font-medium', isToday(day) ? 'text-primary' : 'text-foreground')}>
                      {day}
                    </span>
                    {hasBlocks && (
                      <div className="flex gap-0.5 mt-1">
                        {dayBlocks.slice(0, 3).map((block) => {
                          const subject = subjects.find((s) => s.id === block.subjectId);
                          return (
                            <div
                              key={block.id}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                block.status === 'completed' ? 'opacity-100' : 'opacity-50'
                              )}
                              style={{ backgroundColor: subject?.color || 'gray' }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 pt-0 border-t border-border mt-4">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary/20" />
                <span>Dia de estudo</span>
              </div>
              {subjects.slice(0, 3).map((subject) => (
                <div key={subject.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                  <span>{subject.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
