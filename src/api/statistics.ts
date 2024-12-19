import { get } from 'aws-amplify/api';

export interface Statistics {
  totalNotes: number;
  notesWithImages: number;
  wordCount: number;
  topWords: { word: string; count: number; }[];
  creationTimeline: { date: string; count: number; }[];
  averageNoteLength: number;
}

export const getStatistics = async (): Promise<Statistics> => {
  try {
    const operation = await get({
      apiName: 'statisticsApi',
      path: '/statistics'
    });
    
    const response = await operation.response;
    if (typeof response.body !== 'string') {
      throw new Error('Unexpected response format');
    }
    
    const data = JSON.parse(response.body) as Statistics;
    return data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};