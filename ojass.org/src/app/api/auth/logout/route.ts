import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        // Expect Authorization header: "Bearer <token>"
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
        }

        const token = authHeader.slice(7).trim();
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
        } catch (err) {
            console.warn('Logout: invalid or expired token', err);
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // Stateless JWT: nothing to revoke unless you implement a blacklist. Client should discard the token.
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

