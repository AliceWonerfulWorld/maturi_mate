import { Festival, OrganizerTask } from '@/types';

/**
 * 祭りとタスクの関連付けロジック
 * 複数の画面で統一された関連付けを行う
 */

/**
 * 祭りに関連するタスクを取得する
 * @param festival 祭り情報
 * @param tasks 全タスクリスト
 * @param strictMode 厳密モード（場所と日付の両方が一致する必要がある）
 * @returns 関連するタスクのリスト
 */
export function getRelatedTasks(
  festival: Festival, 
  tasks: OrganizerTask[], 
  strictMode: boolean = false
): OrganizerTask[] {
  if (!festival) return [];
  
  return tasks.filter(task => {
    if (strictMode) {
      // 厳密モード: 場所と日付の両方が一致
      return task.location === festival.location && task.date === festival.date;
    } else {
      // 緩いモード: 場所が一致するか、タスク名に祭り名が含まれる
      return task.location === festival.location || 
             task.title.toLowerCase().includes(festival.name.toLowerCase().split(' ')[0] || '');
    }
  });
}

/**
 * タスクに関連する祭りを取得する
 * @param task タスク情報
 * @param festivals 全祭りリスト
 * @param strictMode 厳密モード（場所と日付の両方が一致する必要がある）
 * @returns 関連する祭りのリスト
 */
export function getRelatedFestivals(
  task: OrganizerTask, 
  festivals: Festival[], 
  strictMode: boolean = true
): Festival[] {
  if (!task) return [];
  
  return festivals.filter(festival => {
    if (strictMode) {
      // 厳密モード: 場所と日付の両方が一致
      return festival.location === task.location && festival.date === task.date;
    } else {
      // 緩いモード: 場所が一致するか、祭り名にタスク名が含まれる
      return festival.location === task.location || 
             festival.name.toLowerCase().includes(task.title.toLowerCase().split(' ')[0] || '');
    }
  });
}

/**
 * 祭りとタスクの関連度を計算する
 * @param festival 祭り情報
 * @param task タスク情報
 * @returns 関連度（0-1の値、1が最も関連性が高い）
 */
export function calculateRelationScore(festival: Festival, task: OrganizerTask): number {
  if (!festival || !task) return 0;
  
  let score = 0;
  
  // 場所の一致（重み: 0.5）
  if (task.location === festival.location) {
    score += 0.5;
  }
  
  // 日付の一致（重み: 0.3）
  if (task.date === festival.date) {
    score += 0.3;
  }
  
  // 名前の部分一致（重み: 0.2）
  const festivalNameWords = festival.name.toLowerCase().split(' ');
  const taskNameWords = task.title.toLowerCase().split(' ');
  
  const commonWords = festivalNameWords.filter(word => 
    taskNameWords.some(taskWord => taskWord.includes(word) || word.includes(taskWord))
  );
  
  if (commonWords.length > 0) {
    score += 0.2 * (commonWords.length / Math.max(festivalNameWords.length, taskNameWords.length));
  }
  
  return Math.min(score, 1);
}

/**
 * 関連度でソートされたタスクを取得する
 * @param festival 祭り情報
 * @param tasks 全タスクリスト
 * @param minScore 最小関連度スコア（デフォルト: 0.1）
 * @returns 関連度でソートされたタスクのリスト
 */
export function getRelatedTasksSorted(
  festival: Festival, 
  tasks: OrganizerTask[], 
  minScore: number = 0.1
): OrganizerTask[] {
  if (!festival) return [];
  
  return tasks
    .map(task => ({
      task,
      score: calculateRelationScore(festival, task)
    }))
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(item => item.task);
}
