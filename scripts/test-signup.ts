import { auth } from "../app/lib/auth";
import { prisma } from "../app/lib/prisma";

async function main() {
  const email = "test-signup@workarail.com";
  try {
    console.log(`Registering ${email}...`);
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password: "Pass1234_test",
        name: "Test Sign Up",
      },
      headers: new Headers(),
    });
    console.log("Signup response:", res);

    // Now query the DB for this user
    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });
    console.log("Resulting user in DB:", JSON.stringify(dbUser, null, 2));

  } catch (error: any) {
    console.error("Signup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
