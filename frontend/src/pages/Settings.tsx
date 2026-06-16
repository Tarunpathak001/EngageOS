import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email} readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Backend URL</Label>
              <Input
                value={
                  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000"
                }
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                Configure via VITE_API_BASE_URL environment variable
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tracking Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Email open tracking:{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                GET /tracking/open/:logId
              </code>
            </p>
            <Separator />
            <p>
              Link click tracking:{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                GET /tracking/click/:logId
              </code>
            </p>
            <p className="text-xs">
              These endpoints are used automatically by the channel service when
              emails are delivered.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}