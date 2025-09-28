'use client';

import { useMemo, useCallback } from 'react';
import { dummyFestivals, dummyOrganizerTasks, dummyApplicants } from '@/lib/dummy-data';

// データローディングの最適化フック
export const useOptimizedData = () => {
  // メモ化されたデータ取得
  const festivals = useMemo(() => dummyFestivals, []);
  const tasks = useMemo(() => dummyOrganizerTasks, []);
  const applicants = useMemo(() => dummyApplicants, []);

  // 統計データの計算（メモ化）
  const stats = useMemo(() => {
    const totalFestivals = festivals.length;
    const totalTasks = tasks.length;
    const totalApplicants = applicants.length;
    const pendingApplications = applicants.filter(app => app.status === 'pending').length;
    
    return {
      totalFestivals,
      totalTasks,
      totalApplicants,
      pendingApplications
    };
  }, [festivals, tasks, applicants]);

  // 最近のデータ取得（メモ化）
  const recentData = useMemo(() => {
    return {
      recentFestivals: festivals.slice(0, 3),
      recentTasks: tasks.slice(0, 3),
      pendingApplicants: applicants.filter(app => app.status === 'pending').slice(0, 3)
    };
  }, [festivals, tasks, applicants]);

  // 検索機能（デバウンス対応）
  const searchFestivals = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return festivals;
    
    const term = searchTerm.toLowerCase();
    return festivals.filter(festival => 
      festival.name.toLowerCase().includes(term) ||
      festival.location.toLowerCase().includes(term) ||
      festival.description.toLowerCase().includes(term)
    );
  }, [festivals]);

  const searchTasks = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return tasks;
    
    const term = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.location.toLowerCase().includes(term)
    );
  }, [tasks]);

  const searchApplicants = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return applicants;
    
    const term = searchTerm.toLowerCase();
    return applicants.filter(applicant => 
      applicant.name.toLowerCase().includes(term) ||
      applicant.profile.toLowerCase().includes(term)
    );
  }, [applicants]);

  return {
    festivals,
    tasks,
    applicants,
    stats,
    recentData,
    searchFestivals,
    searchTasks,
    searchApplicants
  };
};
