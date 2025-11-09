import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
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
          redirectUrl="/dashboard"
          routing="path"
          path="/sign-up"
        />
      </div>
    </div>
  );
}
