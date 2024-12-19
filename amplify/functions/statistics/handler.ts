import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Get authenticated user ID from the event
    const userId = event.requestContext.authorizer?.claims?.sub;
    
    // Query DynamoDB for user's notes
    const result = await dynamodb.scan({
      TableName: process.env.NOTES_TABLE_NAME!, // We'll need to pass this from the function definition
      FilterExpression: 'owner = :owner',
      ExpressionAttributeValues: {
        ':owner': userId
      }
    }).promise();

    const notes = result.Items || [];

    const statistics = {
      totalNotes: notes.length,
      notesWithImages: notes.filter(note => note.imageKey).length,
      wordCount: countTotalWords(notes),
      topWords: findTopWords(notes),
      creationTimeline: createTimeline(notes),
      averageNoteLength: calculateAverageLength(notes)
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(statistics)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: 'Error calculating statistics' })
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
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);

  notes.forEach(note => {
    const words = `${note.title} ${note.content}`.toLowerCase()
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
    return sum + (note.content?.length || 0);
  }, 0);
  
  return Math.round(totalLength / notes.length);
}