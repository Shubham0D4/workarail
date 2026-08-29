import { auth } from "../app/lib/auth";

async function main() {
  try {
    console.log("Attempting signInEmail...");
    const res = await auth.api.signInEmail({
      body: {
        email: "shubhamd@tvita.in",
        password: "Pass1234",
      },
      headers: new Headers(),
    });
    console.log("Sign in response:", res);
  } catch (error: any) {
    console.error("Sign in failed with error:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.status);
    console.error("Full error object:", error);
  }
}

main();
