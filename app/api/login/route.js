import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { signJwtAccessToken } from "@/helpers/jwt";

export async function POST(request) {
    try {
        // Parse JSON data from the request
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Both email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json({ message: "User Not Found" }, { status: 400 });
        }

        // Compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Generate JWT access token
            const accessToken = signJwtAccessToken(user);

            // Return user data along with access token
            return NextResponse.json({ result: { ...user, accessToken } }, { status: 200 });
        } else {
            // Incorrect password
            return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ message: "Something went wrong while trying to log in" }, { status: 500 });
    }
}
