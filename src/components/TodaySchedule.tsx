import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudyBlockCard } from './StudyBlockCard';
import { StudyBlock, Subject } from '@/types/study';

interface TodayScheduleProps {
  blocks: StudyBlock[];
  subjects: Subject[];
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onFailedToday: () => void;
}

export function TodaySchedule({ blocks, subjects, onComplete, onSkip, onFailedToday }: TodayScheduleProps) {
  const getSubject = (id: string) => subjects.find((s) => s.id === id);
  const getTopic = (subjectId: string, topicId: string) => {
    const s = getSubject(subjectId);
    return s?.topics.find((t) => t.id === topicId);
  };

  const pendingBlocks = blocks.filter((b) => b.status === 'pending');
  const completedBlocks = blocks.filter((b) => b.status === 'completed');

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Cronograma de Hoje</h2>
          <p className="text-sm text-muted-foreground">
            {pendingBlocks.length} blocos restantes • {completedBlocks.length} concluídos
          </p>
        </div>

        <Button
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={onFailedToday}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Falhei hoje
        </Button>
      </div>

      <div className="space-y-3">
        {blocks.map((block, index) => {
          const subject = getSubject(block.subjectId);
          const topic = getTopic(block.subjectId, block.topicId);

          if (!subject || !topic) return null;

          return (
            <StudyBlockCard
              key={block.id}
              block={block}
              subject={subject}
              topic={topic}
              onComplete={onComplete}
              onSkip={onSkip}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
}
