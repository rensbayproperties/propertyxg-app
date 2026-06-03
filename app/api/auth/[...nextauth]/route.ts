import { authOptions } from "@/utils/authOption";
import NextAuth from "next-auth";

const handler: any = NextAuth(authOptions);

export { handler as GET, handler as POST };
