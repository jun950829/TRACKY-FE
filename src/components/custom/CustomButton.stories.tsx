import type { Meta, StoryObj } from "@storybook/react";
import { CustomButton } from "./CustomButton";
import { Trash, Pencil, Plus } from "lucide-react";

const meta: Meta<typeof CustomButton> = {
  title: "Components/CustomButton",
  component: CustomButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { 
      control: "select", 
      options: ["default", "outline", "destructive", "ghost", "edit"] 
    },
    size: { 
      control: "select", 
      options: ["default", "sm", "lg", "icon"] 
    },
    fullWidth: { 
      control: "boolean" 
    },
    icon: { 
      control: "object" 
    },
    disabled: { 
      control: "boolean" 
    }
  },
};

export default meta;
type Story = StoryObj<typeof CustomButton>;

export const Default: Story = {
  args: {
    children: "기본 버튼",
    variant: "default",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "아웃라인 버튼",
    variant: "outline",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "삭제 버튼",
    variant: "destructive",
    size: "default",
  },
};

export const Edit: Story = {
  args: {
    children: "수정 버튼",
    variant: "edit",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: "고스트 버튼",
    variant: "ghost",
    size: "default",
  },
};

export const Small: Story = {
  args: {
    children: "작은 버튼",
    variant: "default",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "큰 버튼",
    variant: "default",
    size: "lg",
  },
};

export const WithIcon: Story = {
  args: {
    children: "아이콘 버튼",
    variant: "default",
    size: "default",
    icon: <Plus />
  },
};

export const Disabled: Story = {
  args: {
    children: "비활성화 버튼",
    variant: "default",
    size: "default",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "전체 너비 버튼",
    variant: "default",
    size: "default",
    fullWidth: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <CustomButton variant="default">기본</CustomButton>
        <CustomButton variant="outline">아웃라인</CustomButton>
        <CustomButton variant="destructive">삭제</CustomButton>
        <CustomButton variant="edit">수정</CustomButton>
        <CustomButton variant="ghost">고스트</CustomButton>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center flex-wrap gap-4">
        <CustomButton size="sm">Small</CustomButton>
        <CustomButton size="default">Default</CustomButton>
        <CustomButton size="lg">Large</CustomButton>
      </div>
    </div>
  ),
};

export const ButtonsWithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <CustomButton icon={<Plus />}>추가</CustomButton>
        <CustomButton variant="edit" icon={<Pencil />}>수정</CustomButton>
        <CustomButton variant="destructive" icon={<Trash />}>삭제</CustomButton>
      </div>
    </div>
  ),
}; 