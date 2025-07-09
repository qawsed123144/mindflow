import { NextRequest, NextResponse } from 'next/server';
const API_URL = process.env.API_BASE + '/mindmaps';

export async function GET(req: NextRequest) {
    const header = req.headers.get('authorization') || '';
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': header,
            }
        })

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}