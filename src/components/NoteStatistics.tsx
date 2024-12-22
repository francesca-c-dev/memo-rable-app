import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { getStatistics } from '../api/statistics';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Statistics {
  totalNotes: number;
  notesWithImages: number;
  wordCount: number;
  topWords: { word: string; count: number; }[];
  creationTimeline: { date: string; count: number; }[];
  averageNoteLength: number;
}

export default function NoteStatistics() {
  const { t } = useTranslation();
  const { data: statistics, isLoading, error } = useQuery<Statistics>({
    queryKey: ['statistics'],
    queryFn: getStatistics
  });

  useEffect(() => {
    console.log(statistics);
  }, [statistics]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="animate-pulse">
            <div className="h-4 bg-default-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-default-200 rounded w-1/2"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody>
          <p className="text-danger">{t('statistics.errorLoading')}</p>
        </CardBody>
      </Card>
    );
  }

  if (!statistics) return null;

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-default-200">
        <h3 className="text-xl font-bold">{t('statistics.title')}</h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-default-500">{t('statistics.totalNotes')}</p>
            <p className="text-2xl font-bold">{statistics.totalNotes}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">{t('statistics.notesWithImages')}</p>
            <p className="text-2xl font-bold">{statistics.notesWithImages}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">{t('statistics.totalWords')}</p>
            <p className="text-2xl font-bold">{statistics.wordCount}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">{t('statistics.averageNoteLength')}</p>
            <p className="text-2xl font-bold">{statistics.averageNoteLength} {t('statistics.characters')}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-default-500 mb-2">{t('statistics.mostUsedWords')}</p>
          <div className="flex gap-2 flex-wrap">
            {statistics?.topWords?.map(({ word, count }) => (
              <span
                key={word}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-400 text-primary dark:text-gray-900 rounded-full text-sm"
              >
                {word} ({count})
              </span>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
