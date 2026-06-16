import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const campaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP"]),
  scheduledAt: z.string().optional(),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSubmit: (data: CampaignFormValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CampaignFormValues>;
}

export function CampaignForm({
  onSubmit,
  isLoading,
  defaultValues,
}: CampaignFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      message: "",
      channel: "EMAIL",
      scheduledAt: "",
      ...defaultValues,
    },
  });

  const channel = watch("channel");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Channel</Label>
        <Select
          value={channel}
          onValueChange={(v) =>
            setValue("channel", v as CampaignFormValues["channel"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} {...register("message")} />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Schedule (optional)</Label>
        <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Campaign"}
      </Button>
    </form>
  );
}