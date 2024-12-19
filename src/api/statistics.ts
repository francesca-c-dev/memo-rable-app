import { Amplify } from 'aws-amplify';
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
      console.log('Making API request to:', {
        apiName: 'statisticsApi',
        path: '/statistics'
      });
  
      const config = Amplify.getConfig();
      console.log('Current Amplify config:', config);
  
      const operation = await get({
        apiName: 'statisticsApi',
        path: '/statistics'
      });
      
      const response = await operation.response;
      console.log('API Response:', response);
  
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