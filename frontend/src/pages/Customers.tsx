import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { customersApi } from "@/api/customers";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

export function Customers() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterMinSpend, setFilterMinSpend] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const customersQuery = useQuery({
    queryKey: ["customers", activeTab, filterCity, filterMinSpend],
    queryFn: async () => {
      if (activeTab === "high-spenders") {
        return (await customersApi.getHighSpenders()).data;
      }
      if (activeTab === "filtered") {
        return (
          await customersApi.filter({
            city: filterCity || undefined,
            minSpend: filterMinSpend ? Number(filterMinSpend) : undefined,
          })
        ).data;
      }
      return (await customersApi.getAll()).data;
    },
  });

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setDialogOpen(false);
      toast({
        title: "Customer added",
        description: "The customer has been added to your CRM.",
        variant: "success",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to add customer",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Customer deleted",
        variant: "success",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to delete",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Manage your customer database and view purchase history"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <CustomerForm
                onSubmit={(data) => createMutation.mutate(data)}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="high-spenders">High Spenders</TabsTrigger>
          <TabsTrigger value="filtered">Filtered</TabsTrigger>
        </TabsList>

        <TabsContent value="filtered" className="space-y-4">
          <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-card p-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g. Mumbai"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minSpend">Min Spend (₹)</Label>
              <Input
                id="minSpend"
                type="number"
                placeholder="5000"
                value={filterMinSpend}
                onChange={(e) => setFilterMinSpend(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value={activeTab} className="mt-6">
          {customersQuery.isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner label="Loading customers..." />
            </div>
          ) : customersQuery.error ? (
            <ErrorAlert message={getErrorMessage(customersQuery.error)} />
          ) : !customersQuery.data?.length ? (
            <EmptyState
              icon={Users}
              title="No customers found"
              description="Add your first customer or adjust your filters to see results."
              action={
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              }
            />
          ) : (
            <CustomerTable
              customers={customersQuery.data}
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={
                deleteMutation.isPending
                  ? (deleteMutation.variables as number)
                  : null
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}