import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary", "danger"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Primary Button",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    label: "Secondary Button",
    variant: "secondary",
    size: "md",
  },
};

export const Danger: Story = {
  args: {
    label: "Danger Button",
    variant: "danger",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    label: "Large Button",
    variant: "primary",
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    label: "Small Button",
    variant: "primary",
    size: "sm",
  },
};
