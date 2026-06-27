import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Customer } from "@/types";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: number) => void;
  isDeleting?: number | null;
}

export function CustomerTable({
  customers,
  onDelete,
  isDeleting,
}: CustomerTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Telegram Status</TableHead>
            <TableHead>Total Spend</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {customer.email}
              </TableCell>
              <TableCell>
                {customer.city ? (
                  <Badge variant="secondary">{customer.city}</Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                {customer.telegramConnected ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                    🟢 Connected
                  </Badge>
                ) : customer.telegramInviteToken && customer.telegramInviteExpiresAt && new Date() < new Date(customer.telegramInviteExpiresAt) ? (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
                    🔴 Invitation Pending
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-zinc-500/30 text-zinc-500 dark:text-zinc-400 bg-zinc-500/5">
                    ⚪ Not Invited
                  </Badge>
                )}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(customer.totalSpend)}
              </TableCell>
              <TableCell>{customer.orders?.length ?? 0}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(customer.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/customers/${customer.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(customer.id)}
                    disabled={isDeleting === customer.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}