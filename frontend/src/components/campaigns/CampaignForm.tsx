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
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "TELEGRAM"]),
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
      {/* Channel Info Banner */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2 leading-relaxed">
        <span className="mt-0.5 text-blue-500 font-semibold select-none">ℹ️</span>
        <p>
          EngageOS currently supports live Email and Telegram campaigns. SMS and WhatsApp channels are available in mock mode to demonstrate the platform's multi-channel architecture.
        </p>
      </div>

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
            <SelectItem value="EMAIL">
              <div className="flex items-center justify-between w-full gap-4">
                <span>Email</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Available
                </span>
              </div>
            </SelectItem>
            <SelectItem 
              value="SMS"
              title="SMS provider integration planned. Currently available for architecture demonstration."
            >
              <div className="flex items-center justify-between w-full gap-4">
                <span>SMS</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium px-2 py-0.5 rounded-full border border-amber-500/20">
                  Mock Mode
                </span>
              </div>
            </SelectItem>
            <SelectItem 
              value="WHATSAPP"
              title="Official WhatsApp Cloud API integration planned. Currently available for architecture demonstration."
            >
              <div className="flex items-center justify-between w-full gap-4">
                <span>WhatsApp</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium px-2 py-0.5 rounded-full border border-amber-500/20">
                  Mock Mode
                </span>
              </div>
            </SelectItem>
            <SelectItem value="TELEGRAM">
              <div className="flex items-center justify-between w-full gap-4">
                <span>Telegram</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Available
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Dynamic Channel Warning Banner */}
        {channel === "SMS" && (
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium animate-fadeIn">
            <span>⚠️</span>
            <span>SMS channel is in Mock Mode. No real SMS messages will be delivered.</span>
          </p>
        )}
        {channel === "WHATSAPP" && (
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium animate-fadeIn">
            <span>⚠️</span>
            <span>WhatsApp channel is in Mock Mode. No real WhatsApp messages will be delivered.</span>
          </p>
        )}
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