'use client';

import { useState } from 'react';

export default function ThemeTestPage() {
  const [isDark, setIsDark] = useState(true);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
        {/* Header with Theme Toggle */}
        <header className="border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              Theme Test Dashboard
            </h1>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Color Palette Display */}
          <section className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-6">
              🎨 Your New Dark Theme Color Palette
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Background Colors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground dark:text-foreground-dark">Background Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-background dark:bg-background-dark border border-border dark:border-border-dark"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Primary</p>
                      <p className="text-xs text-subtle dark:text-subtle-dark">#101010</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-background-alt dark:bg-background-alt-dark border border-border dark:border-border-dark"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Secondary</p>
                      <p className="text-xs text-subtle dark:text-subtle-dark">#1A1A1A</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Colors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground dark:text-foreground-dark">Text Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-foreground dark:bg-foreground-dark"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Primary Text</p>
                      <p className="text-xs text-subtle dark:text-subtle-dark">#F5F5F5</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-subtle dark:bg-subtle-dark"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Subtle Text</p>
                      <p className="text-xs text-subtle dark:text-subtle-dark">#A0A0A0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent Colors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground dark:text-foreground-dark">Accent Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-accent"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Accent</p>
                      <p className="text-xs text-subtle dark:text-subtle-dark">#FF6B00</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-accent-hover"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Accent Hover</p>
                      <p className="text-xs text-subtle dark:text-subtle-dark">#FF8533</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Border Color */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground dark:text-foreground-dark">Border Color</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-border dark:bg-border-dark"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-foreground-dark">Border</p>
                    <p className="text-xs text-subtle dark:text-subtle-dark">#2C2C2C</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Cards Demo (Like your screenshot) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: '💵' },
              { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', icon: '👥' },
              { title: 'Sales', value: '+12,234', change: '+19% from last month', icon: '📊' },
              { title: 'Active Now', value: '+573', change: '+201 since last hour', icon: '📈' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-subtle dark:text-subtle-dark">{stat.title}</p>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">{stat.value}</p>
                <p className="text-xs text-subtle dark:text-subtle-dark">{stat.change}</p>
              </div>
            ))}
          </section>

          {/* Chart Demo */}
          <section className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-6">Sales Overview</h3>
            <div className="flex items-end justify-between space-x-2 h-64">
              {[3, 4, 3.5, 5, 5.5, 6, 7, 7.5, 8, 9, 9.5, 10].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-accent hover:bg-accent-hover transition-colors rounded-t cursor-pointer"
                    style={{ height: `${height * 10}%` }}
                  ></div>
                  <p className="text-xs text-center text-subtle dark:text-subtle-dark mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Sales List */}
          <section className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-6">Recent Sales</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                      U
                    </div>
                    <div>
                      <p className="font-medium text-foreground dark:text-foreground-dark">User Name</p>
                      <p className="text-sm text-subtle dark:text-subtle-dark">user.name@email.com</p>
                    </div>
                  </div>
                  <p className="font-bold text-foreground dark:text-foreground-dark">+$1,999.00</p>
                </div>
              ))}
            </div>
          </section>

          {/* Button Examples */}
          <section className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-6">Button Examples</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors">
                Primary Action
              </button>
              <button className="px-6 py-3 bg-surface-hover dark:bg-surface-hover border border-border dark:border-border-dark text-foreground dark:text-foreground-dark font-medium rounded-lg hover:bg-border dark:hover:bg-border-dark transition-colors">
                Secondary Action
              </button>
              <button className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white font-medium rounded-lg transition-colors">
                Outlined Button
              </button>
            </div>
          </section>

          {/* Form Example */}
          <section className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-6">Form Example</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg text-foreground dark:text-foreground-dark placeholder:text-subtle dark:placeholder:text-subtle-dark focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg text-foreground dark:text-foreground-dark placeholder:text-subtle dark:placeholder:text-subtle-dark focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
              <button className="w-full px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors">
                Send Message
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
