import { NextRequest, NextResponse } from 'next/server';
const API_URL = process.env.API_BASE + '/signup';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("SignUp API error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}