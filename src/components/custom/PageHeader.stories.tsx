// src/components/PageHeader.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from './PageHeader';
import { Car } from 'lucide-react';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const 기본: Story = {
  args: {
    title: '차량 관리 시스템',
  },
};

export const 아이콘포함: Story = {
  args: {
    title: '차량 관리 시스템',
    icon: <Car className="w-6 h-6 text-blue-600" />,
  },
};

export const 다양한크기: Story = {
  render: () => (
    <div className="space-y-4">
      <PageHeader title="Small" size="sm" />
      <PageHeader title="Base" size="base" />
      <PageHeader title="Large" size="lg" />
      <PageHeader title="XLarge" size="xl" />
    </div>
  ),
};

export const 굵기옵션: Story = {
  render: () => (
    <div className="space-y-4">
      <PageHeader title="기본(Bold)" bold />
      <PageHeader title="Normal(기본체)" bold={false} />
    </div>
  ),
};

export const 다양한색상: Story = {
  render: () => (
    <div className="space-y-4">
      <PageHeader title="기본 (검정)" />
      <PageHeader title="회색 (text-gray-600)" color="text-gray-600" />
      <PageHeader title="파랑 (text-blue-600)" color="text-blue-600" />
      <PageHeader title="빨강 (text-red-600)" color="text-red-600" />
    </div>
  ),
};