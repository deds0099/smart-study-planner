import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { TodaySchedule } from '@/components/TodaySchedule';
import { SubjectProgress } from '@/components/SubjectProgress';
import { WeeklyView } from '@/components/WeeklyView';
import { AlertsPanel } from '@/components/AlertsPanel';
import { FailedDayDialog } from '@/components/FailedDayDialog';
import { initialSubjects, initialBlocks, initialAlerts } from '@/data/initialData';
import { StudyBlock, Subject, Alert } from '@/types/study';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [blocks, setBlocks] = useState<StudyBlock[]>(initialBlocks);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isFailedDialogOpen, setIsFailedDialogOpen] = useState(false);
  const { toast } = useToast();

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const completedBlocks = blocks.filter((b) => b.status === 'completed').length;
  const pendingBlocks = blocks.filter((b) => b.status === 'pending').length;

  const handleCompleteBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'completed', completedAt: new Date() } : b))
    );
    toast({
      title: '✅ Bloco concluído!',
      description: 'Parabéns, continue assim!',
    });
  };

  const handleSkipBlock = (id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'skipped' } : b)));
    toast({
      title: 'Bloco pulado',
      description: 'Ele será reagendado automaticamente.',
    });
  };

  const handleFailedToday = () => {
    setIsFailedDialogOpen(true);
  };

  const handleReorganize = () => {
    setIsFailedDialogOpen(false);
    toast({
      title: '🔄 Cronograma reorganizado!',
      description: `${pendingBlocks} blocos foram redistribuídos para os próximos dias.`,
    });
  };

  const handleMarkAlertAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const handleSubjectClick = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    toast({
      title: subject?.name,
      description: `${subject?.topics.filter((t) => t.completed).length}/${subject?.topics.length} tópicos concluídos`,
    });
  };

  const hoursStudied = Math.round((completedBlocks * 45) / 60 * 10) / 10;

  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={unreadAlerts} onAlertsClick={() => setIsAlertsOpen(true)} />

      <main className="container mx-auto px-4 py-6 space-y-8 pb-20">
        <StatsOverview
          blocksCompleted={completedBlocks}
          totalBlocks={blocks.length}
          hoursToday={hoursStudied}
          streak={7}
        />

        <TodaySchedule
          blocks={blocks}
          subjects={subjects}
          onComplete={handleCompleteBlock}
          onSkip={handleSkipBlock}
          onFailedToday={handleFailedToday}
        />

        <WeeklyView />

        <SubjectProgress subjects={subjects} onSubjectClick={handleSubjectClick} />
      </main>

      <AlertsPanel
        alerts={alerts}
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onMarkAsRead={handleMarkAlertAsRead}
      />

      <FailedDayDialog
        isOpen={isFailedDialogOpen}
        onClose={() => setIsFailedDialogOpen(false)}
        onReorganize={handleReorganize}
        pendingBlocks={pendingBlocks}
      />
    </div>
  );
};

export default Index;
