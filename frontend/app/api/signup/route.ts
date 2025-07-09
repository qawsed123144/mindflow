import type { NextApiRequest, NextApiResponse } from 'next';

const SignupAPI = process.env.API_BASE + '/signup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const backendRes = await fetch(SignupAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });

    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
}