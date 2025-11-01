'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Home, Building, Calculator, ArrowRight, Check, X, 
  Mail, Phone, FileText, AlertCircle, CheckCircle2,
  Sun, Moon, Zap, Battery, Sparkles, Loader2, Circle
} from 'lucide-react';

type TabType = 'buttons' | 'colors' | 'typography' | 'icons' | 'forms' | 'cards' | 'spacing';

export default function ComponentLibrary() {
  const [activeTab, setActiveTab] = useState<TabType>('buttons');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'buttons', label: 'Buttons', icon: <Zap className="h-4 w-4" /> },
    { id: 'colors', label: 'Colors', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'typography', label: 'Typography', icon: <FileText className="h-4 w-4" /> },
    { id: 'icons', label: 'Icons', icon: <Sun className="h-4 w-4" /> },
    { id: 'forms', label: 'Forms', icon: <Mail className="h-4 w-4" /> },
    { id: 'cards', label: 'Cards', icon: <Building className="h-4 w-4" /> },
    { id: 'spacing', label: 'Spacing', icon: <Battery className="h-4 w-4" /> },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Component Library</h1>
              <p className="text-sm text-muted-foreground">Single Source of Truth (SOT) for all UI components</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Dark Theme Locked
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="secondary"
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? '!text-white !shadow-neu-inset-sm'
                    : ''
                }`}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'buttons' && <ButtonsTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'typography' && <TypographyTab />}
        {activeTab === 'icons' && <IconsTab />}
        {activeTab === 'forms' && <FormsTab />}
        {activeTab === 'cards' && <CardsTab />}
        {activeTab === 'spacing' && <SpacingTab />}
      </div>
    </main>
  );
}

// ========================================
// BUTTONS TAB
// ========================================
function ButtonsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Neumorphic Button System</h2>
        <p className="text-sm text-muted-foreground">Centralized button component with dark theme neumorphism</p>
      </div>

      <div className="grid gap-6">
        {/* Primary Variant */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">primary</CardTitle>
              <Badge>White Border + Transparent</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Button variant="primary">Instant Quote</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="font-mono bg-muted/50 p-2 rounded">
                <div>variant=&quot;primary&quot;</div>
                <div className="text-[10px] mt-1">border border-white bg-transparent text-white shadow-neu-outset-sm hover:shadow-neu-inset-sm</div>
              </div>
            </div>
            <div className="text-xs">
              <strong>Used in:</strong> Hero (Instant Quote), Instant Quote Form (main CTAs)
            </div>
          </CardContent>
        </Card>

        {/* Secondary Variant */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">secondary</CardTitle>
              <Badge variant="outline">Filled Neumorphic</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Button variant="secondary">Rebates</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="font-mono bg-muted/50 p-2 rounded">
                <div>variant=&quot;secondary&quot;</div>
                <div className="text-[10px] mt-1">bg-neumorphic-background text-brand-gray-400 shadow-neu-outset-sm hover:shadow-neu-inset-sm</div>
              </div>
            </div>
            <div className="text-xs">
              <strong>Used in:</strong> Hero (Rebates), Instant Quote Form (Back, Next Step)
            </div>
          </CardContent>
        </Card>

        {/* Ghost Variant */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">ghost</CardTitle>
              <Badge variant="outline">Subtle</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Button variant="ghost">Dashboard</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="font-mono bg-muted/50 p-2 rounded">
                <div>variant=&quot;ghost&quot;</div>
                <div className="text-[10px] mt-1">bg-transparent hover:bg-white/10</div>
              </div>
            </div>
            <div className="text-xs">
              <strong>Used in:</strong> HeaderMenu (Dashboard), QuoteOptionsModal
            </div>
          </CardContent>
        </Card>

        {/* Outline Variant */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">outline</CardTitle>
              <Badge variant="outline">Bordered</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Button variant="outline">Login</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="font-mono bg-muted/50 p-2 rounded">
                <div>variant=&quot;outline&quot;</div>
                <div className="text-[10px] mt-1">border-2 border-border bg-transparent shadow-neu-outset-sm</div>
              </div>
            </div>
            <div className="text-xs">
              <strong>Used in:</strong> HeaderMenu (Login), ProfileManagement
            </div>
          </CardContent>
        </Card>

        {/* Minimal Variant */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">minimal</CardTitle>
              <Badge variant="outline">Text-like</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Button variant="minimal">Edit Profile</Button>
              <Button variant="minimal" disabled>Disabled</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="font-mono bg-muted/50 p-2 rounded">
                <div>variant=&quot;minimal&quot;</div>
                <div className="text-[10px] mt-1">bg-transparent hover:text-primary shadow-none border-none</div>
              </div>
            </div>
            <div className="text-xs">
              <strong>Used in:</strong> QuoteBuilderModal (7x), ProfileManagement (10x)
            </div>
          </CardContent>
        </Card>

        {/* Destructive Variant */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">destructive</CardTitle>
              <Badge variant="destructive">Danger</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Button variant="destructive">Delete</Button>
              <Button variant="destructive" disabled>Disabled</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="font-mono bg-muted/50 p-2 rounded">
                <div>variant=&quot;destructive&quot;</div>
                <div className="text-[10px] mt-1">bg-destructive text-destructive-foreground shadow-lg</div>
              </div>
            </div>
            <div className="text-xs">
              <strong>Used in:</strong> ProfileManagement (Delete actions 2x)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========================================
// COLORS TAB
// ========================================
function ColorsTab() {
  const colors = [
    { name: 'Primary', var: '--primary', usage: 'Main brand color, CTAs', class: 'bg-primary' },
    { name: 'Background', var: '--background', usage: 'Page background', class: 'bg-background' },
    { name: 'Foreground', var: '--foreground', usage: 'Text on background', class: 'bg-foreground' },
    { name: 'Muted', var: '--muted', usage: 'Subtle backgrounds', class: 'bg-muted' },
    { name: 'Muted Foreground', var: '--muted-foreground', usage: 'Secondary text', class: 'bg-muted-foreground' },
    { name: 'Card', var: '--card', usage: 'Card backgrounds', class: 'bg-card' },
    { name: 'Border', var: '--border', usage: 'All borders', class: 'bg-border' },
    { name: 'Destructive', var: '--destructive', usage: 'Error, danger', class: 'bg-destructive' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Color System</h2>
        <p className="text-sm text-muted-foreground">All colors use CSS variables from globals.css. NEVER use hardcoded colors.</p>
      </div>

      <div className="grid gap-4">
        {colors.map((color) => (
          <Card key={color.name}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg border ${color.class}`}></div>
                <div className="flex-1">
                  <div className="font-semibold">{color.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{color.var}</div>
                  <div className="text-xs text-muted-foreground mt-1">{color.usage}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono bg-muted px-2 py-1 rounded">{color.class}</div>
                  <div className="text-xs font-mono bg-muted px-2 py-1 rounded mt-1">text-{color.class.replace('bg-', '')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>❌ NEVER use:</strong> bg-teal-600, bg-slate-700, text-blue-500, border-gray-300, etc.
              <br />
              <strong>✅ ALWAYS use:</strong> bg-primary, bg-muted, text-foreground, border-border
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// TYPOGRAPHY TAB
// ========================================
function TypographyTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Typography Tokens</h2>
        <p className="text-sm text-muted-foreground">Use semantic tokens instead of raw Tailwind classes</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Headings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-4">
                <h1 className="text-4xl font-bold">Heading 1</h1>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-heading-1 (text-4xl font-bold)</div>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h2 className="text-3xl font-bold">Heading 2</h2>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-heading-2 (text-3xl font-bold)</div>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-2xl font-semibold">Heading 3</h3>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-heading-3 (text-2xl font-semibold)</div>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="text-xl font-semibold">Heading 4</h4>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-heading-4 (text-xl font-semibold)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Body Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-muted pl-4">
                <p className="text-base">Body text - Default size for paragraphs and content</p>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-body (text-base)</div>
              </div>
              <div className="border-l-4 border-muted pl-4">
                <p className="text-sm">Small body text - For secondary content</p>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-body-small (text-sm)</div>
              </div>
              <div className="border-l-4 border-muted pl-4">
                <p className="text-xs">Caption text - For hints and metadata</p>
                <div className="text-xs text-muted-foreground font-mono mt-1">text-caption (text-xs)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>❌ NEVER use:</strong> text-xs, text-sm, text-2xl, text-4xl, font-bold, font-semibold directly
                <br />
                <strong>✅ ALWAYS use:</strong> text-heading-*, text-body, text-caption (tokens to be defined in Tailwind config)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========================================
// ICONS TAB
// ========================================
function IconsTab() {
  const iconSizes = [
    { name: 'XS', class: 'h-3 w-3', px: '12px', usage: 'Badges, inline icons' },
    { name: 'SM', class: 'h-4 w-4', px: '16px', usage: 'Buttons, form labels' },
    { name: 'MD', class: 'h-5 w-5', px: '20px', usage: 'Cards, list items' },
    { name: 'LG', class: 'h-6 w-6', px: '24px', usage: 'Headers, navigation' },
    { name: 'XL', class: 'h-8 w-8', px: '32px', usage: 'Hero sections, modals' },
  ];

  const commonIcons = [
    { Icon: Home, name: 'Home' },
    { Icon: Building, name: 'Building' },
    { Icon: Calculator, name: 'Calculator' },
    { Icon: ArrowRight, name: 'ArrowRight' },
    { Icon: Check, name: 'Check' },
    { Icon: X, name: 'X' },
    { Icon: Mail, name: 'Mail' },
    { Icon: Phone, name: 'Phone' },
    { Icon: FileText, name: 'FileText' },
    { Icon: AlertCircle, name: 'AlertCircle' },
    { Icon: CheckCircle2, name: 'CheckCircle2' },
    { Icon: Sun, name: 'Sun' },
    { Icon: Moon, name: 'Moon' },
    { Icon: Zap, name: 'Zap' },
    { Icon: Battery, name: 'Battery' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Icon System</h2>
        <p className="text-sm text-muted-foreground">All icons use lucide-react. NO inline SVGs allowed.</p>
      </div>

      {/* Icon Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Icon Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {iconSizes.map((size) => (
              <div key={size.name} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-20 font-mono text-sm font-semibold">{size.name}</div>
                <Sun className={size.class} />
                <div className="flex-1">
                  <div className="text-sm font-mono">{size.class}</div>
                  <div className="text-xs text-muted-foreground">{size.px} - {size.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Icons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Icons (lucide-react)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {commonIcons.map(({ Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Icon className="h-6 w-6" />
                <div className="text-xs text-center font-mono">{name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>❌ NEVER use:</strong> Inline &lt;svg&gt; tags
              <br />
              <strong>✅ ALWAYS use:</strong> import {'{IconName}'} from &apos;lucide-react&apos;
              <br />
              <strong>Example:</strong> <code className="bg-muted px-1 rounded">import {'{Calculator}'} from &apos;lucide-react&apos;; &lt;Calculator className=&quot;h-5 w-5&quot; /&gt;</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// FORMS TAB
// ========================================
function FormsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Form Components</h2>
        <p className="text-sm text-muted-foreground">All forms use shadcn/ui form components</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Input Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Normal Input */}
          <div className="space-y-2">
            <Label htmlFor="normal">Normal Input</Label>
            <Input id="normal" type="text" placeholder="Enter text..." />
            <div className="text-xs text-muted-foreground font-mono">
              &lt;Input type=&quot;text&quot; placeholder=&quot;...&quot; /&gt;
            </div>
          </div>

          {/* Disabled Input */}
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled Input</Label>
            <Input id="disabled" type="text" placeholder="Disabled..." disabled />
            <div className="text-xs text-muted-foreground font-mono">
              &lt;Input disabled /&gt;
            </div>
          </div>

          {/* Error State */}
          <div className="space-y-2">
            <Label htmlFor="error">Error State</Label>
            <Input id="error" type="text" placeholder="Error..." className="border-destructive" />
            <div className="text-xs text-destructive">This field is required</div>
            <div className="text-xs text-muted-foreground font-mono">
              &lt;Input className=&quot;border-destructive&quot; /&gt;
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>✅ ALWAYS use:</strong> shadcn Input, Label, Textarea, Select components
              <br />
              <strong>Form validation:</strong> Use border-destructive for error states
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// CARDS TAB
// ========================================
function CardsTab() {
  const iconCards = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
      title: "Web Development",
      description: "Crafting high-performance websites and applications with modern, scalable technologies."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a2.25 2.25 0 012.4-2.245 4.5 4.5 0 00-8.4 2.245c0 .399.078.78.22 1.128zm0 0a15.998 15.998 0 00-3.388 1.62m5.043-.025a15.998 15.998 0 01-1.622 3.385m1.622-3.385a2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385" />
        </svg>
      ),
      title: "UI/UX Design",
      description: "Designing intuitive and engaging user interfaces that provide a seamless user experience."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      title: "SEO & Marketing",
      description: "Boosting your online presence and driving organic traffic through proven SEO strategies."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Neumorphic Card System</h2>
        <p className="text-sm text-muted-foreground">Centralized shadcn/ui Card with dark theme and neumorphic shadows</p>
      </div>

      {/* Icon Card Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Icon Card</h3>
            <p className="text-sm text-muted-foreground">Service cards with neumorphic icons</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Pixel Perfect
          </Badge>
        </div>

        {/* Live Example */}
        <div className="grid md:grid-cols-3 gap-8 p-8 bg-background rounded-xl">
          {iconCards.map((card, index) => (
            <div 
              key={index} 
              className="bg-background p-8 rounded-2xl shadow-neu-outset text-center transition-all duration-300 hover:shadow-neu-outset-lg"
            >
              <div className="w-20 h-20 rounded-full bg-background shadow-neu-inset flex items-center justify-center mx-auto mb-6 text-primary">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Code Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage & Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
              <div className="text-primary">{`// Icon Card Structure`}</div>
              <div>&lt;div className=&quot;bg-background p-8 rounded-2xl shadow-neu-outset text-center&quot;&gt;</div>
              <div className="ml-4">&lt;div className=&quot;w-20 h-20 rounded-full bg-background shadow-neu-inset flex items-center justify-center mx-auto mb-6&quot;&gt;</div>
              <div className="ml-8">&lt;Icon className=&quot;w-8 h-8 text-primary&quot; /&gt;</div>
              <div className="ml-4">&lt;/div&gt;</div>
              <div className="ml-4">&lt;h3 className=&quot;text-xl font-bold text-foreground mb-2&quot;&gt;Title&lt;/h3&gt;</div>
              <div className="ml-4">&lt;p className=&quot;text-muted-foreground text-sm&quot;&gt;Description&lt;/p&gt;</div>
              <div>&lt;/div&gt;</div>
            </div>
            <div className="text-xs space-y-2">
              <div><strong>Used in:</strong> Services Section, Feature Cards</div>
              <div><strong>Key Classes:</strong></div>
              <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                <li><span className="font-mono">shadow-neu-outset</span> - Raised card effect</li>
                <li><span className="font-mono">shadow-neu-inset</span> - Inset icon container</li>
                <li><span className="font-mono">rounded-2xl</span> - Card border radius</li>
                <li><span className="font-mono">rounded-full</span> - Icon container circle</li>
                <li><span className="font-mono">p-8</span> - Card padding</li>
                <li><span className="font-mono">w-20 h-20</span> - Icon container size</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <strong className="text-yellow-500">Design Notes:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>Icons use <span className="font-mono">text-primary</span> for brand color</li>
                  <li>Hover effect adds <span className="font-mono">shadow-neu-outset-lg</span></li>
                  <li>Perfect for service cards, feature highlights, or benefit sections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standard Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Standard Cards</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Standard Card */}
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>Default card with border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Uses border-border, bg-card, rounded-xl</p>
            </CardContent>
          </Card>

          {/* Card with Neumorphic Shadow */}
          <Card className="shadow-neu-outset">
            <CardHeader>
              <CardTitle>Neumorphic Card</CardTitle>
              <CardDescription>With shadow-neu-outset</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add shadow-neu-outset class for depth</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm font-mono bg-muted p-3 rounded-lg">
            <div>&lt;Card&gt; or &lt;Card className=&quot;shadow-neu-outset&quot;&gt;</div>
            <div className="ml-4">&lt;CardHeader&gt;&lt;CardTitle&gt;...&lt;/CardTitle&gt;&lt;/CardHeader&gt;</div>
            <div className="ml-4">&lt;CardContent&gt;...&lt;/CardContent&gt;</div>
            <div>&lt;/Card&gt;</div>
          </div>
          <div className="text-xs space-y-1">
            <div><strong>Used in:</strong> Instant Quote Form, Admin Dashboard, Profile Management</div>
            <div><strong>Classes:</strong> bg-card, border-border, rounded-xl</div>
          </div>
        </CardContent>
      </Card>

      {/* Reserved Space */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">More Card Styles (Reserved)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Space reserved for hover effects, interactive cards, and custom variants.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// SPACING TAB
// ========================================
function SpacingTab() {
  const spacing = [
    { name: 'space-1', value: '4px', usage: 'Tight spacing between related items' },
    { name: 'space-2', value: '8px', usage: 'Default gap between elements' },
    { name: 'space-3', value: '12px', usage: 'Medium gap' },
    { name: 'space-4', value: '16px', usage: 'Standard padding, margins' },
    { name: 'space-6', value: '24px', usage: 'Card padding, section spacing' },
    { name: 'space-8', value: '32px', usage: 'Large section spacing' },
    { name: 'space-12', value: '48px', usage: 'Major section breaks' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Spacing Scale</h2>
        <p className="text-sm text-muted-foreground">Consistent spacing using Tailwind default scale</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spacing Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spacing.map((s) => (
              <div key={s.name} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-24 font-mono text-sm font-semibold">{s.name}</div>
                <div className="bg-primary rounded" style={{ width: s.value, height: '24px' }}></div>
                <div className="flex-1">
                  <div className="text-sm font-mono">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 space-y-2">
            <div className="font-semibold text-sm">Card Padding</div>
            <div className="text-xs text-muted-foreground font-mono">p-4 or p-6 (CardContent default)</div>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <div className="font-semibold text-sm">Section Spacing</div>
            <div className="text-xs text-muted-foreground font-mono">py-12 or py-16 for major sections</div>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <div className="font-semibold text-sm">Button Spacing</div>
            <div className="text-xs text-muted-foreground font-mono">gap-2 or gap-4 between buttons</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
