'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'

import { MindMap } from '@/lib/types'

export function useMindMap() {
    const { user } = useAuth()
    const [mindMaps, setMindMaps] = useState<MindMap[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        loadMindMaps();
    }, [!!user])

    async function loadMindMaps() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mindmaps', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch mind maps')
            }
            const data = await res.json()
            setMindMaps(data)
        } catch (err) {
            console.error('Error loading mind maps', err);
        } finally {
            setLoading(false)
        }
    }

    async function updateMindMap(id: string, updates: Partial<MindMap>) {
        if (!user) return;

        if (user.role === 'demo') {
            setMindMaps((prev => prev.map(m => m._id === id ? { ...m, ...updates } : m)))
            return
        }

        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            const res = await fetch(`/api/mindmaps/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(updates),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update mind map');
            }

            await loadMindMaps();

        } catch (err) {
            console.error('Error updating mind maps', err);
        }

        finally {
            setLoading(false);
        }
    }


    return { mindMaps, setMindMaps, updateMindMap, loading, }
}
