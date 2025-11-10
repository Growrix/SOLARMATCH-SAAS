'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const isInstaller = role === 'installer';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {isInstaller && (
          <div className="mb-6 rounded-2xl bg-primary/10 border border-primary/30 p-4 text-center shadow-neu-inset">
            <h3 className="text-lg font-bold text-primary mb-1">Installer Signup</h3>
            <p className="text-sm text-muted-foreground">
              You&apos;re signing up as a solar installer partner
            </p>
          </div>
        )}
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'theme-card shadow-neu-outset',
              headerTitle: 'text-foreground text-2xl font-bold',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'btn-secondary shadow-neu-outset-sm hover:shadow-neu-inset-sm transition-all duration-200',
              socialButtonsBlockButtonText: 'text-foreground font-medium',
              dividerLine: 'bg-border',
              dividerText: 'text-muted-foreground',
              formButtonPrimary: 'btn-primary shadow-neu-outset hover:shadow-neu-inset transition-all duration-200',
              formFieldInput: 'form-input',
              formFieldLabel: 'text-foreground font-medium',
              footerActionLink: 'text-primary hover:underline',
              footerActionText: 'text-muted-foreground',
              identityPreviewText: 'text-foreground',
              identityPreviewEditButton: 'text-primary hover:underline',
            },
          }}
          unsafeMetadata={{
            role: isInstaller ? 'INSTALLER' : 'HOMEOWNER',
          }}
          redirectUrl={isInstaller ? '/installer/dashboard' : '/homeowner/dashboard'}
          routing="path"
          path="/sign-up"
        />
      </div>
    </div>
  );
}
