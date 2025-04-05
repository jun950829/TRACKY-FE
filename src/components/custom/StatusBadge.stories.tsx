// src/components/custom/StatusBadge.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge from './StatusBadge';
import { CarStatus, RentStatus } from '@/constants/status';

/**
 * `StatusBadge` 컴포넌트는 애플리케이션 전반에 걸쳐 일관된 스타일의 상태 표시를 제공합니다.
 * 차량 상태와 렌트 상태에 따라 적절한 색상과 스타일이 자동으로 적용됩니다.
 * 
 * 이 컴포넌트는 다음과 같은 특징을 가집니다:
 * - 상태 유형별 일관된 색상 체계
 * - 손쉬운 크기 조절 및 커스터마이징
 * - 테이블 및 다양한 UI 요소와 함께 사용 가능
 */
const meta: Meta<typeof StatusBadge> = {
  title: 'Components/Custom/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: { 
      control: 'text',
      description: '표시할 상태 텍스트',
      table: {
        type: { summary: 'string' },
      }
    },
    type: { 
      control: 'radio',
      options: ['car', 'rent'],
      description: '상태 유형 (car 또는 rent)',
      table: {
        type: { summary: "'car' | 'rent'" },
        defaultValue: { summary: 'car' },
      }
    },
    className: { 
      control: 'text',
      description: '추가적인 CSS 클래스',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      }
    }
  },
  parameters: {
    componentSubtitle: '상태를 시각적으로 표현하는 뱃지 컴포넌트',
    docs: {
      description: {
        component: 
          '`StatusBadge` 컴포넌트는 상태 정보를 시각적으로 표현하는 배지입니다. ' +
          '`getStatusBadgeClass` 유틸리티 함수를 사용하여 상태에 따른 적절한 스타일을 적용합니다.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

// 기본 상태 배지
export const 기본: Story = {
  args: {
    status: '운행중',
    type: 'car',
  },
  parameters: {
    docs: {
      description: {
        story: '가장 기본적인 상태 배지 사용 예시입니다.'
      }
    }
  }
};

// 차량 상태 배지 모음
export const 차량상태배지: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {CarStatus
        .filter(status => status.value !== 'all')
        .map((status) => (
          <StatusBadge 
            key={status.value} 
            status={status.label} 
            type="car" 
          />
        ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 차량 상태 옵션을 보여주는 예시입니다. 각 상태는 미리 정의된 색상 스키마에 따라 표시됩니다.'
      }
    }
  }
};

// 렌트 상태 배지 모음
export const 렌트상태배지: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {RentStatus
        .filter(status => status.value !== 'all')
        .map((status) => (
          <StatusBadge 
            key={status.value} 
            status={status.label} 
            type="rent" 
          />
        ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 렌트 상태 옵션을 보여주는 예시입니다. 각 상태는 미리 정의된 색상 스키마에 따라 표시됩니다.'
      }
    }
  }
};

// 추가 클래스를 적용한 상태 배지
export const 커스텀스타일: Story = {
  args: {
    status: '운행중',
    type: 'car',
    className: 'text-base py-1.5 px-3',
  },
  parameters: {
    docs: {
      description: {
        story: '`className` 속성을 사용하여 배지의 기본 스타일을 확장하거나 변경할 수 있습니다.'
      }
    }
  }
};

// 다양한 크기의 상태 배지
export const 다양한크기: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-gray-500">작은 크기:</span>
        <StatusBadge status="운행중" type="car" className="text-xs" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-gray-500">기본 크기:</span>
        <StatusBadge status="운행중" type="car" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-gray-500">중간 크기:</span>
        <StatusBadge status="운행중" type="car" className="text-sm py-1.5 px-3" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-gray-500">큰 크기:</span>
        <StatusBadge status="운행중" type="car" className="text-base py-2 px-4" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`className` 속성을 통해 배지의 크기를 다양하게 조정할 수 있습니다. Tailwind CSS의 크기 관련 클래스를 활용합니다.'
      }
    }
  }
};

// 테이블에서의 상태 배지 활용 예시
export const 테이블활용예시: Story = {
  render: () => (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">이름</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">CAR-001</td>
            <td className="px-4 py-3 text-sm text-gray-900">현대 아반떼</td>
            <td className="px-4 py-3 text-sm text-gray-900">
              <StatusBadge status="운행중" type="car" />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">CAR-002</td>
            <td className="px-4 py-3 text-sm text-gray-900">기아 K5</td>
            <td className="px-4 py-3 text-sm text-gray-900">
              <StatusBadge status="정비중" type="car" />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">RENT-001</td>
            <td className="px-4 py-3 text-sm text-gray-900">김철수</td>
            <td className="px-4 py-3 text-sm text-gray-900">
              <StatusBadge status="예약" type="rent" />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">RENT-002</td>
            <td className="px-4 py-3 text-sm text-gray-900">이영희</td>
            <td className="px-4 py-3 text-sm text-gray-900">
              <StatusBadge status="반납완료" type="rent" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '테이블 내에서 StatusBadge 컴포넌트를 활용하는 일반적인 사용 사례입니다. 이는 CarTable과 RentTable 컴포넌트의 실제 구현과 유사합니다.'
      }
    }
  }
}; 