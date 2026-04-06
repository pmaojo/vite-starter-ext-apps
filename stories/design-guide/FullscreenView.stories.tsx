import type { Meta, StoryObj } from "@storybook/react";
import { FullscreenView } from "@/shared/components/ui/fullscreen-view";

const meta = {
  title: "Guía de Diseño/Layout/FullscreenView",
  component: FullscreenView,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**Fullscreen View**

Immersive experiences that expand beyond the inline card, giving users space for multi-step workflows or deeper exploration.
The ChatGPT composer remains overlaid, allowing users to continue “talking to the app” through natural conversation in the context of the fullscreen view.

**Reglas de Uso (Rules of thumb):**
- **Design your UX to work with the system composer.** The composer is always present in fullscreen, so make sure your experience supports conversational prompts.
- **Use fullscreen to deepen engagement**, not to replicate your native app wholesale.
        `,
      },
      story: {
        inline: false, // Force iframe rendering to simulate full screen
        iframeHeight: 600,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FullscreenView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Interactive Map Workflow",
    onClose: () =>
      alert(
        "Close clicked. In ChatGPT, this collapses the view back to inline."
      ),
    children: (
      <div className="flex flex-col h-full items-center justify-center border-2 border-dashed rounded-xl p-8 text-center text-muted-foreground bg-muted/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 opacity-50"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h3 className="text-xl font-bold mb-2">Rich Interactive Area</h3>
        <p className="max-w-md">
          This area is ideal for complex charts, deep data exploration, or
          interactive canvases that require more space than an inline card
          provides.
        </p>
        <p className="max-w-md mt-4 text-sm bg-background p-3 rounded-md border shadow-sm">
          💡 <strong>Tip:</strong> Users will continue chatting with the model
          via the standard composer overlaid at the bottom of the screen.
        </p>
      </div>
    ),
  },
};
