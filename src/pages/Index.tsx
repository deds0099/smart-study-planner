import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { TodaySchedule } from '@/components/TodaySchedule';
import { SubjectProgress } from '@/components/SubjectProgress';
import { WeeklyView } from '@/components/WeeklyView';
import { AlertsPanel } from '@/components/AlertsPanel';
import { FailedDayDialog } from '@/components/FailedDayDialog';
import { AddTopicsModal } from '@/components/AddTopicsModal';
import { EmptyState } from '@/components/EmptyState';
import { initialAlerts } from '@/data/initialData';
import { StudyBlock, Subject, Alert, Topic, Difficulty } from '@/types/study';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [blocks, setBlocks] = useState<StudyBlock[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isFailedDialogOpen, setIsFailedDialogOpen] = useState(false);
  const [isAddTopicsOpen, setIsAddTopicsOpen] = useState(false);
  const [hasGeneratedSchedule, setHasGeneratedSchedule] = useState(false);
  const { toast } = useToast();

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const completedBlocks = blocks.filter((b) => b.status === 'completed').length;
  const pendingBlocks = blocks.filter((b) => b.status === 'pending').length;
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);

  const handleAddSubject = (subject: Omit<Subject, 'id' | 'topics'>) => {
    const newSubject: Subject = {
      ...subject,
      id: `subject_${Date.now()}`,
      topics: [],
    };
    setSubjects((prev) => [...prev, newSubject]);
    toast({
      title: '✅ Matéria adicionada!',
      description: subject.name,
    });
  };

  const handleAddTopic = (subjectId: string, topic: Omit<Topic, 'id' | 'subjectId' | 'completed'>) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newTopic: Topic = {
          ...topic,
          id: `topic_${Date.now()}`,
          subjectId,
          completed: false,
        };
        return { ...s, topics: [...s.topics, newTopic] };
      })
    );
  };

  const handleRemoveTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        return { ...s, topics: s.topics.filter((t) => t.id !== topicId) };
      })
    );
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const generateSchedule = () => {
    const today = new Date();
    const newBlocks: StudyBlock[] = [];
    
    // Ordenar por peso (matérias mais importantes primeiro)
    const sortedSubjects = [...subjects].sort((a, b) => b.weight - a.weight);
    
    // Criar blocos para cada tópico
    sortedSubjects.forEach((subject) => {
      subject.topics.forEach((topic, index) => {
        // Distribuir blocos ao longo dos dias
        const dayOffset = Math.floor(index / 2);
        const scheduledDate = new Date(today);
        scheduledDate.setDate(today.getDate() + dayOffset);

        // Determinar tipo de estudo baseado na dificuldade
        const studyTypes: Array<'theory' | 'questions' | 'revision'> = ['theory', 'questions'];
        const type = studyTypes[index % 2];

        // Duração baseada na dificuldade
        const durationMap: Record<Difficulty, number> = {
          easy: 40,
          medium: 50,
          hard: 60,
        };

        newBlocks.push({
          id: `block_${Date.now()}_${index}_${topic.id}`,
          subjectId: subject.id,
          topicId: topic.id,
          duration: durationMap[topic.difficulty],
          type,
          status: 'pending',
          scheduledFor: scheduledDate,
        });
      });
    });

    // Pegar apenas os 4 primeiros blocos para hoje
    const todayBlocks = newBlocks.slice(0, 4);
    
    setBlocks(todayBlocks);
    setHasGeneratedSchedule(true);
    setIsAddTopicsOpen(false);
    
    toast({
      title: '🎯 Cronograma gerado!',
      description: `${todayBlocks.length} blocos de estudo criados para hoje.`,
    });
  };

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
  const showEmptyState = totalTopics === 0 || !hasGeneratedSchedule;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        alertCount={unreadAlerts} 
        onAlertsClick={() => setIsAlertsOpen(true)}
        onAddTopicsClick={() => setIsAddTopicsOpen(true)}
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
        onAddSubject={handleAddSubject}
        onAddTopic={handleAddTopic}
        onRemoveTopic={handleRemoveTopic}
        onRemoveSubject={handleRemoveSubject}
        onGenerateSchedule={generateSchedule}
      />
    </div>
  );
};

export default Index;
