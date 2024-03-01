import prisma from "@/helpers/prisma";
import bcrypt from 'bcrypt';

export async function loginUser(credentials) {
  try {
    const { email, password } = credentials;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // If user not found, return null
    if (!user) {
      return null;
    }

    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, return user object
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message || "Something went wrong while trying to log in");
  }
}
