
import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';
import { ThemeDecorator } from './theme-decorator';

const preview: Preview = {
  decorators: [ThemeDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;