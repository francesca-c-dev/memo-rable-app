
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

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
      const { tokens } = await fetchAuthSession();
     
      
      console.log('Making API request...');
      const operation = await get({
        apiName: 'statisticsApi',
        path: '/statistics',
        options: {
          headers: {
            Authorization: `Bearer ${tokens?.idToken?.toString()}`
          }
        }
      });
      
      console.log('Got operation response');
      const response = await operation.response;
      console.log('Full Response:', response);
      console.log('Response status:', response.statusCode);
  
      // Handle ReadableStream
      if (response.body instanceof ReadableStream) {
        const reader = response.body.getReader();
        const textDecoder = new TextDecoder();
        let result = '';
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += textDecoder.decode(value);
        }
  
        console.log('Decoded response:', result);
        const data = JSON.parse(result) as Statistics;
        return data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Detailed error in statistics service:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  };