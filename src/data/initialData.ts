import { Subject, StudyBlock, Alert } from '@/types/study';

export const initialSubjects: Subject[] = [
  {
    id: 'portugues',
    name: 'Português',
    color: 'hsl(217 91% 50%)',
    weight: 22,
    topics: [
      { id: 'p1', name: 'Interpretação de Texto', subjectId: 'portugues', difficulty: 'medium', completed: true, lastStudied: new Date() },
      { id: 'p2', name: 'Sintaxe', subjectId: 'portugues', difficulty: 'hard', completed: true, lastStudied: new Date() },
      { id: 'p3', name: 'Concordância Verbal', subjectId: 'portugues', difficulty: 'hard', completed: false },
      { id: 'p4', name: 'Concordância Nominal', subjectId: 'portugues', difficulty: 'medium', completed: false },
      { id: 'p5', name: 'Regência Verbal', subjectId: 'portugues', difficulty: 'hard', completed: false },
      { id: 'p6', name: 'Regência Nominal', subjectId: 'portugues', difficulty: 'medium', completed: false },
      { id: 'p7', name: 'Crase', subjectId: 'portugues', difficulty: 'medium', completed: false },
      { id: 'p8', name: 'Pontuação', subjectId: 'portugues', difficulty: 'easy', completed: false },
      { id: 'p9', name: 'Classes de Palavras', subjectId: 'portugues', difficulty: 'medium', completed: false },
      { id: 'p10', name: 'Morfologia', subjectId: 'portugues', difficulty: 'hard', completed: false },
    ],
  },
  {
    id: 'matematica',
    name: 'Matemática/Raciocínio Lógico',
    color: 'hsl(24 95% 53%)',
    weight: 18,
    topics: [
      { id: 'm1', name: 'Porcentagem', subjectId: 'matematica', difficulty: 'easy', completed: true, lastStudied: new Date() },
      { id: 'm2', name: 'Regra de Três', subjectId: 'matematica', difficulty: 'easy', completed: false },
      { id: 'm3', name: 'Equações 1º Grau', subjectId: 'matematica', difficulty: 'easy', completed: false },
      { id: 'm4', name: 'Equações 2º Grau', subjectId: 'matematica', difficulty: 'medium', completed: false },
      { id: 'm5', name: 'Probabilidade', subjectId: 'matematica', difficulty: 'hard', completed: false },
      { id: 'm6', name: 'Análise Combinatória', subjectId: 'matematica', difficulty: 'hard', completed: false },
      { id: 'm7', name: 'Proposições Lógicas', subjectId: 'matematica', difficulty: 'medium', completed: false },
      { id: 'm8', name: 'Tabelas Verdade', subjectId: 'matematica', difficulty: 'medium', completed: false },
    ],
  },
  {
    id: 'veterinaria',
    name: 'Veterinária/Higiene Animal',
    color: 'hsl(142 76% 36%)',
    weight: 25,
    topics: [
      { id: 'v1', name: 'Anatomia Animal', subjectId: 'veterinaria', difficulty: 'hard', completed: false },
      { id: 'v2', name: 'Fisiologia Animal', subjectId: 'veterinaria', difficulty: 'hard', completed: false },
      { id: 'v3', name: 'Doenças Infecciosas', subjectId: 'veterinaria', difficulty: 'hard', completed: false },
      { id: 'v4', name: 'Parasitologia', subjectId: 'veterinaria', difficulty: 'medium', completed: false },
      { id: 'v5', name: 'Higiene e Sanidade', subjectId: 'veterinaria', difficulty: 'medium', completed: false },
      { id: 'v6', name: 'Inspeção de Carnes', subjectId: 'veterinaria', difficulty: 'medium', completed: false },
      { id: 'v7', name: 'Inspeção de Leite', subjectId: 'veterinaria', difficulty: 'medium', completed: false },
      { id: 'v8', name: 'Zoonoses', subjectId: 'veterinaria', difficulty: 'hard', completed: false },
      { id: 'v9', name: 'Nutrição Animal', subjectId: 'veterinaria', difficulty: 'medium', completed: false },
      { id: 'v10', name: 'Reprodução Animal', subjectId: 'veterinaria', difficulty: 'hard', completed: false },
      { id: 'v11', name: 'Farmacologia Veterinária', subjectId: 'veterinaria', difficulty: 'hard', completed: false },
      { id: 'v12', name: 'Legislação Sanitária', subjectId: 'veterinaria', difficulty: 'easy', completed: false },
    ],
  },
];

const today = new Date();

export const initialBlocks: StudyBlock[] = [
  {
    id: 'b1',
    subjectId: 'veterinaria',
    topicId: 'v1',
    duration: 50,
    type: 'theory',
    status: 'pending',
    scheduledFor: today,
  },
  {
    id: 'b2',
    subjectId: 'portugues',
    topicId: 'p3',
    duration: 45,
    type: 'theory',
    status: 'pending',
    scheduledFor: today,
  },
  {
    id: 'b3',
    subjectId: 'matematica',
    topicId: 'm2',
    duration: 40,
    type: 'questions',
    status: 'pending',
    scheduledFor: today,
  },
  {
    id: 'b4',
    subjectId: 'portugues',
    topicId: 'p1',
    duration: 30,
    type: 'revision',
    status: 'pending',
    scheduledFor: today,
  },
];

export const initialAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'revision',
    message: 'Revisão pendente: Interpretação de Texto (24h)',
    createdAt: new Date(),
    read: false,
  },
  {
    id: 'a2',
    type: 'achievement',
    message: '🎉 Parabéns! Você completou 3 tópicos de Português!',
    createdAt: new Date(Date.now() - 86400000),
    read: true,
  },
];
