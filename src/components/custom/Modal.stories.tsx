import type { Meta, StoryObj } from "@storybook/react"
import { useArgs } from "@storybook/preview-api"
import { CommonModal } from "./Modal"

const meta: Meta<typeof CommonModal> = {
  title: "Components/CommonModal",
  component: CommonModal,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    confirmText: { control: "text" },
    cancelText: { control: "text" },
    showCancel: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof CommonModal>

export const Default: Story = {
  args: {
    open: true,
    title: "알림",
    description: "이 작업을 진행하시겠습니까?",
    confirmText: "확인",
    cancelText: "취소",
    showCancel: true,
  },
  decorators: [
    () => {
      const [args, updateArgs] = useArgs()

      return (
        <CommonModal
        open={false} {...args}
        onClose={() => updateArgs({ open: false })}
        onConfirm={() => {
          alert("확인 버튼 클릭")
        } }       
        />
      )
    },
  ],
}

export const WithoutCancel: Story = {
  args: {
    open: true,
    title: "완료",
    description: "작업이 완료되었습니다.",
    confirmText: "닫기",
    showCancel: false,
  },
  decorators: [
    () => {
      const [args, updateArgs] = useArgs()

      return (
        <CommonModal
        open={false} {...args}
        onClose={() => updateArgs({ open: false })}
        onConfirm={() => {
          alert("확인 버튼 클릭")
        } }       
        />
      )
    },
  ],
}
