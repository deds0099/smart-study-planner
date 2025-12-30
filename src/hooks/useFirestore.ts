import { useEffect, useState } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
    setDoc,
    getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Subject, StudyBlock, Alert } from '@/types/study';

const USER_ID = 'default_user'; // Por enquanto, um único usuário. Pode ser expandido para autenticação

interface Settings {
    blocksPerDay: number;
    blockDuration: number;
    notificationsEnabled: boolean;
    darkMode: boolean;
}

export function useFirestore() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [blocks, setBlocks] = useState<StudyBlock[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [studyDays, setStudyDays] = useState<number[]>([1, 2, 3, 4, 5]);
    const [settings, setSettings] = useState<Settings>({
        blocksPerDay: 4,
        blockDuration: 45,
        notificationsEnabled: true,
        darkMode: false,
        subjectsPerDay: 2,
    });
    const [loading, setLoading] = useState(true);

    // Sincronizar subjects
    useEffect(() => {
        const q = query(collection(db, `users/${USER_ID}/subjects`), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subjectsData: Subject[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    color: data.color,
                    weight: data.weight,
                    topics: data.topics || [],
                };
            });
            setSubjects(subjectsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sincronizar blocks
    useEffect(() => {
        const q = query(collection(db, `users/${USER_ID}/blocks`), orderBy('scheduledFor'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const blocksData: StudyBlock[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    subjectId: data.subjectId,
                    topicId: data.topicId,
                    duration: data.duration,
                    type: data.type,
                    status: data.status,
                    scheduledFor: data.scheduledFor.toDate(),
                    completedAt: data.completedAt?.toDate(),
                };
            });
            setBlocks(blocksData);
        });

        return () => unsubscribe();
    }, []);

    // Sincronizar alerts
    useEffect(() => {
        const q = query(collection(db, `users/${USER_ID}/alerts`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alertsData: Alert[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: data.type,
                    message: data.message,
                    createdAt: data.createdAt.toDate(),
                    read: data.read,
                };
            });
            setAlerts(alertsData);
        });

        return () => unsubscribe();
    }, []);

    // Sincronizar settings e studyDays
    useEffect(() => {
        const settingsRef = doc(db, `users/${USER_ID}/config/settings`);
        const unsubscribe = onSnapshot(settingsRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setSettings({
                    blocksPerDay: data.blocksPerDay || 4,
                    blockDuration: data.blockDuration || 45,
                    notificationsEnabled: data.notificationsEnabled ?? true,
                    darkMode: data.darkMode ?? false,
                });
                setStudyDays(data.studyDays || [1, 2, 3, 4, 5]);
            }
        });

        return () => unsubscribe();
    }, []);

    // Funções CRUD para Subjects
    const addSubject = async (subject: Omit<Subject, 'id' | 'topics'>) => {
        await addDoc(collection(db, `users/${USER_ID}/subjects`), {
            ...subject,
            topics: [],
        });
    };

    const updateSubject = async (subjectId: string, updates: Partial<Subject>) => {
        const subjectRef = doc(db, `users/${USER_ID}/subjects`, subjectId);
        await updateDoc(subjectRef, updates);
    };

    const removeSubject = async (subjectId: string) => {
        await deleteDoc(doc(db, `users/${USER_ID}/subjects`, subjectId));
    };

    // Funções CRUD para Blocks
    const addBlock = async (block: Omit<StudyBlock, 'id'>) => {
        await addDoc(collection(db, `users/${USER_ID}/blocks`), {
            ...block,
            scheduledFor: Timestamp.fromDate(block.scheduledFor),
            completedAt: block.completedAt ? Timestamp.fromDate(block.completedAt) : null,
        });
    };

    const updateBlock = async (blockId: string, updates: Partial<StudyBlock>) => {
        const blockRef = doc(db, `users/${USER_ID}/blocks`, blockId);
        const updateData: any = { ...updates };

        if (updates.scheduledFor) {
            updateData.scheduledFor = Timestamp.fromDate(updates.scheduledFor);
        }
        if (updates.completedAt) {
            updateData.completedAt = Timestamp.fromDate(updates.completedAt);
        }

        await updateDoc(blockRef, updateData);
    };

    const removeBlock = async (blockId: string) => {
        await deleteDoc(doc(db, `users/${USER_ID}/blocks`, blockId));
    };

    const replaceBlocks = async (newBlocks: StudyBlock[]) => {
        // Remove todos os blocos existentes
        const existingBlocks = blocks;
        for (const block of existingBlocks) {
            await removeBlock(block.id);
        }

        // Adiciona novos blocos
        for (const block of newBlocks) {
            await addBlock(block);
        }
    };

    // Funções CRUD para Alerts
    const addAlert = async (alert: Omit<Alert, 'id'>) => {
        await addDoc(collection(db, `users/${USER_ID}/alerts`), {
            ...alert,
            createdAt: Timestamp.fromDate(alert.createdAt),
        });
    };

    const updateAlert = async (alertId: string, updates: Partial<Alert>) => {
        const alertRef = doc(db, `users/${USER_ID}/alerts`, alertId);
        await updateDoc(alertRef, updates);
    };

    // Funções para Settings e StudyDays
    const updateSettings = async (newSettings: Settings) => {
        const settingsRef = doc(db, `users/${USER_ID}/config/settings`);
        await setDoc(settingsRef, {
            ...newSettings,
            studyDays,
        }, { merge: true });
    };

    const updateStudyDays = async (days: number[]) => {
        const settingsRef = doc(db, `users/${USER_ID}/config/settings`);
        await setDoc(settingsRef, {
            studyDays: days,
        }, { merge: true });
    };

    return {
        // Data
        subjects,
        blocks,
        alerts,
        studyDays,
        settings,
        loading,

        // Subject operations
        addSubject,
        updateSubject,
        removeSubject,

        // Block operations
        addBlock,
        updateBlock,
        removeBlock,
        replaceBlocks,

        // Alert operations
        addAlert,
        updateAlert,

        // Settings operations
        updateSettings,
        updateStudyDays,
    };
}
