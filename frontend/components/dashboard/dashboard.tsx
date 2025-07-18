'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/context/auth-context';
import { useMindMap } from '@/hooks/use-minmap';
import { useLanguage } from '@/context/language-context';
import { AuthForm } from '@/components/auth/auth-form';
import { MindMapList } from '@/components/mind-map/mind-map-list';
import { MindMapEditor } from '@/components/mind-map/mind-map-editor';
import { MindMap } from '@/lib/types';
import { Header } from '@/components/ui/header';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const { mindMaps, loading, loadMindMaps } = useMindMap();
  const [selectedMap, setSelectedMap] = useState<MindMap | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">MindFlow</h1>
          <p className="text-gray-600 dark:text-gray-400">{t.createCollaborateTrack}</p>
        </div>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <div className="flex flex-col md:flex-row flex-1">
        {!selectedMap ? (
          <div className="w-full p-6">
            <MindMapList
              mindMaps={mindMaps}
              onSelect={setSelectedMap}
              onCreateNew={() => {
                const newMap: MindMap = {
                  title: t.untitledMindMap,
                  description: '',
                  nodes: [],
                  edges: [],
                  createdBy: user.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  collaborators: [
                    {
                      user_id: user.id,
                      role: 'viewer'
                    }
                  ]
                };
                setSelectedMap(newMap);
              }}
            />
          </div>
        ) : (
          <MindMapEditor
            mindMap={selectedMap}
            onBack={() => {
              setSelectedMap(null)
              loadMindMaps();
            }
            }
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
}