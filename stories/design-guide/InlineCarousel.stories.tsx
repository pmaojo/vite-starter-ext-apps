import type { Meta, StoryObj } from "@storybook/react";
import { InlineCarousel } from "@/shared/components/ui/inline-carousel";

const meta = {
  title: "Guía de Diseño/Layout/InlineCarousel",
  component: InlineCarousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Inline Carousel**

A set of cards presented side-by-side, letting users quickly scan and choose from multiple options.

**Reglas de Uso (Rules of thumb):**
- **Keep to 3–8 items per carousel** for scannability.
- **Reduce metadata** to the most relevant details, with three lines max.
- **Each card may have a single, optional CTA** (for example, “Book” or “Play”).
- **Use consistent visual hierarchy** across cards.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: 1,
        title: "Café de la Musique",
        image:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
        badge: "4.8 ★",
        metadata: ["Café • $", "0.2 mi away", "Open until 6 PM"],
        actionLabel: "View Menu",
      },
      {
        id: 2,
        title: "Bistro Verde",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
        badge: "4.5 ★",
        metadata: ["French • $$", "0.5 mi away", "Reservations required"],
        actionLabel: "Book Table",
      },
      {
        id: 3,
        title: "Sushi Zen",
        image:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
        badge: "4.9 ★",
        metadata: ["Japanese • $$$", "1.1 mi away", "Open until 10 PM"],
        actionLabel: "Order",
      },
      {
        id: 4,
        title: "Taco Stand",
        image:
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80",
        metadata: ["Mexican • $", "1.5 mi away", "Takeaway only"],
        actionLabel: "Directions",
      },
    ],
  },
};
