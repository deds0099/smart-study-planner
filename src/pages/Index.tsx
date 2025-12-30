import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { TodaySchedule } from '@/components/TodaySchedule';
import { SubjectProgress } from '@/components/SubjectProgress';
import { WeeklyView } from '@/components/WeeklyView';
import { AlertsPanel } from '@/components/AlertsPanel';
import { FailedDayDialog } from '@/components/FailedDayDialog';
import { AddTopicsModal } from '@/components/AddTopicsModal';
import { EmptyState } from '@/components/EmptyState';
import { SubjectDetailModal } from '@/components/SubjectDetailModal';
import { CalendarModal } from '@/components/CalendarModal';
import { SettingsModal } from '@/components/SettingsModal';
import { StudyBlock, Subject, Topic, Difficulty } from '@/types/study';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';

const Index = () => {
  // Firebase data and operations
  const {
    subjects,
    blocks,
    alerts,
    studyDays,
    settings,
    loading,
    addSubject,
    updateSubject,
    removeSubject,
    updateBlock,
    replaceBlocks,
    updateAlert,
    updateSettings,
    updateStudyDays,
  } = useFirestore();

  // Local UI state
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isFailedDialogOpen, setIsFailedDialogOpen] = useState(false);
  const [isAddTopicsOpen, setIsAddTopicsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [hasGeneratedSchedule, setHasGeneratedSchedule] = useState(false);
  const { toast } = useToast();

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const completedBlocks = blocks.filter((b) => b.status === 'completed').length;
  const pendingBlocks = blocks.filter((b) => b.status === 'pending').length;
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);

  const handleAddSubject = async (subject: Omit<Subject, 'id' | 'topics'>) => {
    await addSubject(subject);
    toast({
      title: '✅ Matéria adicionada!',
      description: subject.name,
    });
  };

  const handleAddTopic = async (subjectId: string, topic: Omit<Topic, 'id' | 'subjectId' | 'completed'>) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const newTopic: Topic = {
      ...topic,
      id: `topic_${Date.now()}`,
      subjectId,
      completed: false,
    };

    await updateSubject(subjectId, {
      topics: [...subject.topics, newTopic],
    });
  };

  const handleRemoveTopic = async (subjectId: string, topicId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    await updateSubject(subjectId, {
      topics: subject.topics.filter((t) => t.id !== topicId),
    });
  };

  const handleRemoveSubject = async (subjectId: string) => {
    await removeSubject(subjectId);
  };

  const handleMarkTopicComplete = async (subjectId: string, topicId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    await updateSubject(subjectId, {
      topics: subject.topics.map((t) =>
        t.id === topicId ? { ...t, completed: true, lastStudied: new Date() } : t
      ),
    });

    toast({
      title: '✅ Tópico concluído!',
      description: 'Seu progresso foi atualizado.',
    });
  };

  const generateSchedule = async () => {
    const today = new Date();
    const newBlocks: StudyBlock[] = [];

    // Ordenar por peso (matérias mais importantes primeiro)
    const sortedSubjects = [...subjects].sort((a, b) => b.weight - a.weight);

    let blockIndex = 0;

    // Criar blocos para cada tópico
    sortedSubjects.forEach((subject) => {
      subject.topics.forEach((topic) => {
        // Calcular o dia baseado nos dias de estudo disponíveis
        const dayOffset = Math.floor(blockIndex / settings.blocksPerDay);
        let actualDayOffset = 0;
        let studyDaysCount = 0;

        while (studyDaysCount <= dayOffset) {
          const dayOfWeek = (today.getDay() + actualDayOffset) % 7;
          if (studyDays.includes(dayOfWeek)) {
            studyDaysCount++;
          }
          if (studyDaysCount <= dayOffset) {
            actualDayOffset++;
          }
        }

        const scheduledDate = new Date(today);
        scheduledDate.setDate(today.getDate() + actualDayOffset);

        // Determinar tipo de estudo
        const studyTypes: Array<'theory' | 'questions' | 'revision'> = ['theory', 'questions'];
        const type = studyTypes[blockIndex % 2];

        // Duração baseada na dificuldade
        const durationMap: Record<Difficulty, number> = {
          easy: Math.max(30, settings.blockDuration - 10),
          medium: settings.blockDuration,
          hard: settings.blockDuration + 10,
        };

        newBlocks.push({
          id: `block_${Date.now()}_${blockIndex}_${topic.id}`,
          subjectId: subject.id,
          topicId: topic.id,
          duration: durationMap[topic.difficulty],
          type,
          status: 'pending',
          scheduledFor: scheduledDate,
        });

        blockIndex++;
      });
    });

    // Pegar apenas os blocos para hoje
    const todayStr = today.toDateString();
    const todayBlocks = newBlocks.filter(
      (b) => new Date(b.scheduledFor).toDateString() === todayStr
    ).slice(0, settings.blocksPerDay);

    await replaceBlocks(todayBlocks.length > 0 ? todayBlocks : newBlocks.slice(0, settings.blocksPerDay));
    setHasGeneratedSchedule(true);
    setIsAddTopicsOpen(false);

    toast({
      title: '🎯 Cronograma gerado!',
      description: `${Math.min(settings.blocksPerDay, newBlocks.length)} blocos de estudo criados para hoje.`,
    });
  };

  const handleCompleteBlock = async (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      // Marcar tópico como estudado
      const subject = subjects.find((s) => s.id === block.subjectId);
      if (subject) {
        await updateSubject(block.subjectId, {
          topics: subject.topics.map((t) =>
            t.id === block.topicId ? { ...t, lastStudied: new Date() } : t
          ),
        });
      }
    }

    await updateBlock(id, { status: 'completed', completedAt: new Date() });
    toast({
      title: '✅ Bloco concluído!',
      description: 'Parabéns, continue assim!',
    });
  };

  const handleSkipBlock = async (id: string) => {
    await updateBlock(id, { status: 'skipped' });
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

  const handleMarkAlertAsRead = async (id: string) => {
    await updateAlert(id, { read: true });
  };

  const handleSubjectClick = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setSelectedSubject(subject);
    }
  };

  const hoursStudied = Math.round((completedBlocks * settings.blockDuration) / 60 * 10) / 10;
  const showEmptyState = totalTopics === 0 || !hasGeneratedSchedule;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        alertCount={unreadAlerts}
        onAlertsClick={() => setIsAlertsOpen(true)}
        onAddTopicsClick={() => setIsAddTopicsOpen(true)}
        onCalendarClick={() => setIsCalendarOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-8 pb-20">
        {showEmptyState ? (
          <EmptyState onAddTopics={() => setIsAddTopicsOpen(true)} />
        ) : (
          <>
            <StatsOverview
              blocksCompleted={completedBlocks}
              totalBlocks={blocks.length}
              hoursToday={hoursStudied}
              streak={1}
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
          </>
        )}
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

      <AddTopicsModal
        isOpen={isAddTopicsOpen}
        onClose={() => setIsAddTopicsOpen(false)}
        subjects={subjects}
        studyDays={studyDays}
        onStudyDaysChange={updateStudyDays}
        onAddSubject={handleAddSubject}
        onAddTopic={handleAddTopic}
        onRemoveTopic={handleRemoveTopic}
        onRemoveSubject={handleRemoveSubject}
        onGenerateSchedule={generateSchedule}
      />

      <SubjectDetailModal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        subject={selectedSubject}
        blocks={blocks}
        onMarkTopicComplete={handleMarkTopicComplete}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        blocks={blocks}
        subjects={subjects}
        studyDays={studyDays}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};

export default Index;
