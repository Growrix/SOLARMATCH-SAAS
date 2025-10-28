import type { Meta, StoryObj } from '@storybook/nextjs';
import { colors } from '@/design-tokens';

/**
 * Color Token Showcase
 * 
 * Displays all semantic color tokens from the centralized design token system.
 * Use this to verify theme consistency, test color changes, and compare light/dark variants.
 * 
 * **Testing Color Changes:**
 * 1. Change `colors.primary` in `src/design-tokens/semantic/colors.ts`
 * 2. Rebuild Storybook: `npm run build-storybook`
 * 3. Run Chromatic: `npx chromatic`
 * 4. Verify diffs show color changes only (no layout/spacing changes)
 */

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Semantic color tokens with light/dark/DEFAULT variants. Single source of truth for all application colors.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Color Swatch Component
 */
const ColorSwatch = ({ name, color, variant }: { name: string; color: string; variant: string }) => (
  <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div
      className="w-24 h-24 rounded-lg border-2 border-gray-300 dark:border-gray-600"
      style={{ backgroundColor: color }}
      title={color}
    />
    <div className="text-center">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{variant}</p>
      <p className="text-xs font-mono text-gray-500 dark:text-gray-500">{color}</p>
    </div>
  </div>
);

/**
 * Color Section Component
 */
const ColorSection = ({ title, colorTokens }: { title: string; colorTokens: Array<{ name: string; token: any }> }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {colorTokens.map(({ name, token }) => (
        <div key={name} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{name}</h3>
          <div className="grid grid-cols-1 gap-2">
            {token.light && <ColorSwatch name={name} color={token.light} variant="Light" />}
            {token.dark && <ColorSwatch name={name} color={token.dark} variant="Dark" />}
            {token.DEFAULT && <ColorSwatch name={name} color={token.DEFAULT} variant="DEFAULT" />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * All Colors Story
 * 
 * Displays complete color palette with all semantic tokens.
 */
export const AllColors: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Design Token Colors</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Centralized color system • Light/Dark variants • Single source of truth
      </p>

      {/* Brand Colors */}
      <ColorSection
        title="Brand Colors"
        colorTokens={[
          { name: 'Primary', token: colors.primary },
          { name: 'Primary Hover', token: colors['primary-hover'] },
          { name: 'Primary Dark', token: colors['primary-dark'] },
          { name: 'Secondary', token: colors.secondary },
          { name: 'Secondary Hover', token: colors['secondary-hover'] },
        ]}
      />

      {/* Status Colors */}
      <ColorSection
        title="Status Colors"
        colorTokens={[
          { name: 'Success', token: colors.success },
          { name: 'Warning', token: colors.warning },
          { name: 'Error', token: colors.error },
          { name: 'Info', token: colors.info },
        ]}
      />

      {/* Background Colors */}
      <ColorSection
        title="Background Colors"
        colorTokens={[
          { name: 'Background', token: colors.background },
          { name: 'Background Alt', token: colors['background-alt'] },
          { name: 'Surface', token: colors.surface },
        ]}
      />

      {/* Text Colors */}
      <ColorSection
        title="Text Colors"
        colorTokens={[
          { name: 'Foreground', token: colors.foreground },
          { name: 'Muted', token: colors.muted },
          { name: 'Subtle', token: colors.subtle },
        ]}
      />

      {/* Border Colors */}
      <ColorSection
        title="Border Colors"
        colorTokens={[
          { name: 'Border', token: colors.border },
          { name: 'Border Focus', token: colors['border-focus'] },
        ]}
      />

      {/* Chart Colors */}
      <ColorSection
        title="Chart Colors"
        colorTokens={[
          { name: 'Chart Primary', token: colors.chart.primary },
          { name: 'Chart Secondary', token: colors.chart.secondary },
          { name: 'Chart Tertiary', token: colors.chart.tertiary },
          { name: 'Chart Success', token: colors.chart.success },
          { name: 'Chart Warning', token: colors.chart.warning },
          { name: 'Chart Error', token: colors.chart.error },
        ]}
      />
    </div>
  ),
};

/**
 * Brand Colors Only Story
 * 
 * Focused view of primary and secondary brand colors for quick verification.
 */
export const BrandColors: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Brand Colors</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Primary (Teal) and Secondary (Amber) brand colors with hover variants
      </p>

      <ColorSection
        title="Primary Brand (Teal)"
        colorTokens={[
          { name: 'Primary', token: colors.primary },
          { name: 'Primary Hover', token: colors['primary-hover'] },
          { name: 'Primary Dark', token: colors['primary-dark'] },
        ]}
      />

      <ColorSection
        title="Secondary Brand (Amber)"
        colorTokens={[
          { name: 'Secondary', token: colors.secondary },
          { name: 'Secondary Hover', token: colors['secondary-hover'] },
        ]}
      />
    </div>
  ),
};

/**
 * Theme Comparison Story
 * 
 * Side-by-side comparison of light and dark theme colors for all tokens.
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="p-8 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Light vs Dark Theme</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Compare color variants across themes • Verify contrast ratios • Test accessibility
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Light Theme */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Light Theme</h2>
          <div className="space-y-4">
            {Object.entries(colors)
              .filter(([_, value]) => typeof value === 'object' && 'light' in value)
              .map(([name, token]: [string, any]) => (
                <div key={name} className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: token.light }}
                    title={token.light}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs font-mono text-gray-600">{token.light}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Dark Theme */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Dark Theme</h2>
          <div className="space-y-4">
            {Object.entries(colors)
              .filter(([_, value]) => typeof value === 'object' && 'dark' in value)
              .map(([name, token]: [string, any]) => (
                <div key={name} className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-700"
                    style={{ backgroundColor: token.dark }}
                    title={token.dark}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{name}</p>
                    <p className="text-xs font-mono text-gray-400">{token.dark}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
