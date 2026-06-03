import { Onest, Quattrocento } from "next/font/google";
import "@/styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { Metadata } from "next";
import QueryClientWrapper from "@/context/QueryClient";
import NextAuthProvider from "@/context/NextAuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOption";

export const metadata: Metadata = {
  title: {
    template: `%s • ${process.env.SITE_NAME}`,
    default: `${process.env.SITE_NAME}`,
  },
  description: `%s | ${process.env.SITE_NAME}`,
  openGraph: {
    description: `%s | ${process.env.SITE_NAME}`,
  },
};
const onest = Onest({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
const quattrocento = Quattrocento({
  weight: ['400', '700'],
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-quattrocento'
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  // const cookieStore = cookies();
  // const tenant = cookieStore.get("tenant")?.value || "def";
  // console.log('tenant', tenant);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${onest.className} ${quattrocento.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <QueryClientWrapper>
            <NextAuthProvider session={session}>{children}</NextAuthProvider>
          </QueryClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
