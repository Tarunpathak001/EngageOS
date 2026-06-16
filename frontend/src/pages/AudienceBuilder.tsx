import { useMutation } from "@tanstack/react-query";
import { Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";
import { audienceApi } from "@/api/audience";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import type { AudiencePreview } from "@/types";

export function AudienceBuilder() {
  const [city, setCity] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [preview, setPreview] = useState<AudiencePreview | null>(null);

  const filterMutation = useMutation({
    mutationFn: () =>
      audienceApi.preview({
        city: city || undefined,
        minSpend: minSpend ? Number(minSpend) : undefined,
      }),
    onSuccess: (res) => setPreview(res.data),
  });

  const aiMutation = useMutation({
    mutationFn: () => audienceApi.aiPreview({ prompt: aiPrompt }),
    onSuccess: (res) => setPreview(res.data),
  });

  const error = filterMutation.error || aiMutation.error;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audience Builder"
        description="Define and preview customer segments for your campaigns"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Tabs defaultValue="filters">
          <TabsList>
            <TabsTrigger value="filters">Manual Filters</TabsTrigger>
            <TabsTrigger value="ai">AI Prompt</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filter Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Delhi, Mumbai, Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minSpend">Minimum Spend (₹)</Label>
                  <Input
                    id="minSpend"
                    type="number"
                    placeholder="5000"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => filterMutation.mutate()}
                  disabled={filterMutation.isPending}
                >
                  {filterMutation.isPending ? "Previewing..." : "Preview Audience"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Audience Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Describe your target audience</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g. Target VIP customers from Bangalore who spent over 10000"
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => aiMutation.mutate()}
                  disabled={aiMutation.isPending || !aiPrompt.trim()}
                >
                  {aiMutation.isPending ? "Analyzing..." : "Generate Preview"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audience Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <ErrorAlert
                message={getErrorMessage(error)}
                className="mb-4"
              />
            )}

            {!preview ? (
              <EmptyState
                icon={UsersRound}
                title="No preview yet"
                description="Configure filters or use AI to preview your audience segment."
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Audience Size</p>
                    <p className="text-3xl font-semibold">{preview.audienceSize}</p>
                  </div>
                  {preview.filters && (
                    <div className="flex flex-wrap gap-2">
                      {preview.filters.city && (
                        <Badge variant="secondary">
                          City: {preview.filters.city}
                        </Badge>
                      )}
                      {preview.filters.minSpend && (
                        <Badge variant="secondary">
                          Min Spend: ₹{preview.filters.minSpend}
                        </Badge>
                      )}
                      {preview.filters.segment && (
                        <Badge variant="secondary">
                          {preview.filters.segment}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {preview.customers.length > 0 && (
                  <div className="max-h-80 overflow-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Spend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.customers.slice(0, 20).map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell>{c.city ?? "—"}</TableCell>
                            <TableCell>{formatCurrency(c.totalSpend)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {preview.customers.length > 20 && (
                      <p className="p-3 text-center text-xs text-muted-foreground">
                        Showing 20 of {preview.customers.length} customers
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}