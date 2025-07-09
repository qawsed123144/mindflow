import { NextRequest, NextResponse } from 'next/server';
const API_URL = process.env.API_BASE + '/mindmap';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    const header = req.headers.get('authorization') || '';
    const body = await req.json();

    try {
        const res = await fetch(`${API_URL}/${params.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': header,
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    }
    catch (err) {
        console.error("Update API error:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
