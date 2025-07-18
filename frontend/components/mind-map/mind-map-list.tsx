'use client';

import { PlusIcon } from 'lucide-react';

import { MindMap } from '@/lib/types';
import { useLanguage } from '@/context/language-context';

import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MindMapListProps {
  mindMaps?: MindMap[];
  onSelect: (mindMap: MindMap) => void;
  onCreateNew: () => void;
}

export function MindMapList({ mindMaps, onSelect, onCreateNew }: MindMapListProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t.yourMindMaps}</h1>
        <Button onClick={onCreateNew} className="w-full sm:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          {t.createNewMindMap} 
        </Button>
      </div>

      {!Array.isArray(mindMaps) || mindMaps.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">{t.noMindMapsFound}</h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            {t.createFirstMindMap}
          </p>
          <Button onClick={onCreateNew} className="mt-4">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t.createMindMap}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(mindMaps) && mindMaps.map((map) => (
            <div
              key={map._id}
              className="border rounded-lg p-6 hover:shadow-md dark:hover:shadow-none dark:hover:bg-gray-800 transition-all cursor-pointer"
              onClick={() => onSelect(map)}
            >
              <h3 className="text-lg font-semibold mb-2 truncate">{map.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {map.description || t.noDescription}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <div>
                  {(map.nodes?.length ?? 0)} {(map.nodes?.length === 1 ? t.node : t.nodes)}
                </div>
                <div>{t.updated} {formatDate(map.updatedAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}