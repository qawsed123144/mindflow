'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<User | null>;
    signOut: () => Promise<void>;
    signUp: (username: string, password: string) => Promise<User | null>;
}

function parseJwt(token: string): User | null {
    try {
        const raw = token.split('.')[1];
        if (!raw) {
            console.warn("Invalid JWT: missing payload");
            return null;
        }

        const json = atob(raw);
        const payload = JSON.parse(json);
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return null;
        }

        const _id = payload.id || payload._id;
        const email = payload.username || payload.email;
        const role = payload.role;

        if (!_id || !email || !role) {
            console.warn("JWT payload missing required fields");
            return null;
        }

        return {
            _id,
            email,
            role,
        };
    } catch (e) {
        console.error("Failed to parse JWT:", e);
        return null;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const parsedUser = parseJwt(token);
            if (parsedUser) {
                setUser(parsedUser);
            }
            else{
                console.error('無法解析使用者資料');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    // SignIn
    const signIn = async (username: string, password: string) => {
        try {
            const res = await fetch('/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            const token = data.token;
            if (!token) throw new Error('token not found');

            const parsedUser = parseJwt(token);
            if (!parsedUser) throw new Error('無法解析使用者資料');

            localStorage.setItem('token', token);
            setUser(parsedUser);

            return parsedUser;

        } catch (error) {
            console.error('SignIn Error:', error);
            throw new Error('Failed to sign in');
        }
    }

    //SignOut
    const signOut = async () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const signUp = async (username: string, password: string) => {
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error('註冊失敗');
            }

            const data = await res.json();
            const token = data.token;
            const parsedUser = parseJwt(token);

            if (!parsedUser) throw new Error('無法解析使用者資料');

            localStorage.setItem('token', token);
            setUser(parsedUser);

            return parsedUser;

        } catch (error) {
            console.error('SignUp Error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
