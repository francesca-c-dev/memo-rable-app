

import type { APIGatewayProxyHandler } from "aws-lambda";

import type { Schema } from '../../data/resource';
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const notesResult = await client.models.Note.list();
    const notes = notesResult.data;

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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify(statistics)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ error: 'Error calculating statistics' })
    };
  }
};

// Helper functions here...

// Helper functions remain the same...

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