import type { Meta, StoryObj } from "@storybook/react";
import { InlineCard } from "@/shared/components/ui/inline-card";
import { Button } from "@/shared/components/ui/button";

const meta = {
  title: "Guía de Diseño/Layout/InlineCard",
  component: InlineCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Inline Card**

Lightweight, single-purpose widgets embedded directly in conversation. They provide quick confirmations, simple actions, or visual aids.

**Reglas de Uso (Rules of thumb):**
- **Limit primary actions per card:** Support up to two actions maximum, with one primary CTA and one optional secondary CTA.
- **No deep navigation:** Cards should not contain multiple drill-ins, tabs, or deeper navigation.
- **No nested scrolling:** Cards should auto-fit their content and prevent internal scrolling.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Booking Confirmation",
    children: (
      <div className="space-y-2 text-sm">
        <p>
          <strong>Flight:</strong> AB123 to New York
        </p>
        <p>
          <strong>Date:</strong> Oct 12, 2024
        </p>
        <p>
          <strong>Status:</strong> Confirmed
        </p>
      </div>
    ),
    primaryActions: <Button size="sm">View Details</Button>,
  },
};

export const Expandable: Story = {
  args: {
    title: "Map View",
    expandable: true,
    children: (
      <div className="h-32 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
        [Map Placeholder]
      </div>
    ),
  },
};

export const TwoActions: Story = {
  args: {
    title: "Approve Expense",
    children: (
      <div className="space-y-2 text-sm text-center">
        <p className="text-2xl font-bold">$125.00</p>
        <p className="text-muted-foreground">Team Lunch - Oct 10</p>
      </div>
    ),
    primaryActions: (
      <>
        <Button variant="outline" size="sm">
          Decline
        </Button>
        <Button size="sm">Approve</Button>
      </>
    ),
  },
};
