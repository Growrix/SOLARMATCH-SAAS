import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Configure your deployment settings below.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p className="text-sm">
          This card contains only content, no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

export const FullStructure: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Solar Installation Quote</CardTitle>
        <CardDescription>Estimated savings for your home</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">System Size:</span>
            <span className="text-sm text-muted-foreground">8.5 kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Estimated Cost:</span>
            <span className="text-sm text-muted-foreground">$25,500</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Annual Savings:</span>
            <span className="text-sm text-success">$1,800</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Detailed Quote</Button>
      </CardFooter>
    </Card>
  ),
};
