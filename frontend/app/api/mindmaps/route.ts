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

export async function POST(req: NextRequest) {
    const header = req.headers.get('authorization') || '';
    const body = await req.json();

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': header,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Create MindMap API error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}