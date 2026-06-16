import { Bot } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">EngageOS</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">
            Customer intelligence and marketing automation for growing teams.
          </h1>
          <p className="text-lg text-slate-300">
            Manage customers, build audiences, launch campaigns, and track
            performance — all from one professional CRM workspace.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: "Customers", value: "Unified CRM" },
              { label: "Campaigns", value: "Multi-channel" },
              { label: "Analytics", value: "AI-powered" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-700 bg-slate-800/50 p-4"
              >
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400">
          Trusted by marketing teams worldwide
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}