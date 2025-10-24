import Card from "@/components/card";
import React from "react";

export default function RegisterGuide() {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
      <div className="space-y-4">
        <div className="flex gap-3 group">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
            1
          </div>
          <div>
            <p className="font-medium">Create your account</p>
            <p className="text-sm text-muted-foreground">
              Fill out the registration form
            </p>
          </div>
        </div>
        <div className="flex gap-3 group">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary bg-muted border border-border text-sm">
            2
          </div>
          <div>
            <p className="font-medium">Login</p>
            <p className="text-sm text-muted-foreground">
              Sign in with your credentials
            </p>
          </div>
        </div>
        <div className="flex gap-3 group">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary bg-muted border border-border text-sm">
            3
          </div>
          <div>
            <p className="font-medium">Connect GitHub</p>
            <p className="text-sm text-muted-foreground">
              Link your GitHub account to start
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
