import { useTranslation } from 'react-i18next';

export default function Notes() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('notes.title')}</h1>
      {/* We'll add the notes content later */}
    </div>
  );
}