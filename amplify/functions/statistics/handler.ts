import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();
const ddb = new DynamoDB();


const TABLE_NAME = 'Note';


export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda function started');
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
/*
    // Just list tables first
    const tableName = process.env.API_MEMORABLE_NOTETABLE_NAME;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        debug: {
          userId,
          timestamp: new Date().toISOString(),
          tables: tableName
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error in Lambda function",
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.name : 'UnknownError',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
    };
  }*/


    const mockStatistics = {
      totalNotes: 5,
      notesWithImages: 2,
      wordCount: 100,
      topWords: [
        { word: "test", count: 5 },
        { word: "example", count: 3 }
      ],
      creationTimeline: [
        { date: "2024-01-01", count: 2 },
        { date: "2024-01-02", count: 3 }
      ],
      averageNoteLength: 50,
      debug: {
        userId,
        timestamp: new Date().toISOString(),
        dynamoDBClientInitialized: !!dynamodb,
        eventInfo: {
          requestContext: event.requestContext,
          headers: event.headers
        }
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockStatistics)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error in Lambda function",
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.name : 'UnknownError',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
    };
  }
};

function countTotalWords(notes: any[]) {
  return notes.reduce((total, note) => {
    const words = (note.content?.split(/\s+/) || []).length + 
                 (note.title?.split(/\s+/) || []).length;
    return total + words;
  }, 0);
}

function findTopWords(notes: any[]) {
  const wordCount: Record<string, number> = {};
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with']);

  notes.forEach(note => {
    const words = `${note.title || ''} ${note.content || ''}`.toLowerCase()
      .split(/\s+/)
      .filter(word => !stopWords.has(word) && word.length > 2);

    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
}

function createTimeline(notes: any[]) {
  const timeline: Record<string, number> = {};
  
  notes.forEach(note => {
    const date = new Date(note.createdAt).toISOString().split('T')[0];
    timeline[date] = (timeline[date] || 0) + 1;
  });

  return Object.entries(timeline)
    .sort()
    .map(([date, count]) => ({ date, count }));
}

function calculateAverageLength(notes: any[]) {
  if (notes.length === 0) return 0;
  
  const totalLength = notes.reduce((sum, note) => {
    return sum + ((note.content?.length || 0) + (note.title?.length || 0));
  }, 0);
  
  return Math.round(totalLength / notes.length);
}