"use client";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SessionDebug = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Session Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>

          <div>
            <strong>User ID:</strong> {session?.user?.id || "Not available"}
          </div>

          <div>
            <strong>User Email:</strong> {session?.user?.email || "Not available"}
          </div>

          <div>
            <strong>Access Token:</strong>
            <pre className="text-xs bg-card-alt p-2 rounded mt-1 break-all">
              {session?.tokens?.access_token ?
                `${session.tokens.access_token.substring(0, 50)}...` :
                "Not available"
              }
            </pre>
          </div>

          <div>
            <strong>Refresh Token:</strong>
            <pre className="text-xs bg-card-alt p-2 rounded mt-1 break-all">
              {session?.tokens?.refresh_token ?
                `${session.tokens.refresh_token.substring(0, 50)}...` :
                "Not available"
              }
            </pre>
          </div>

          <div>
            <strong>Company:</strong> {session?.user?.company?.username || "Not available"}
          </div>

          <div>
            <strong>Full Session:</strong>
            <pre className="text-xs bg-card-alt p-2 rounded mt-1 overflow-auto max-h-40">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionDebug;
