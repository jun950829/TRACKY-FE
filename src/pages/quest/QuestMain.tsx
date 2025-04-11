import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/libs/apis/dashboardApi';

function QuestMain() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await sendQuestData({ title, content });
      console.log(result);
      setIsSubmitted(true);
    } catch (error) {
      console.error('문의 전송 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuestData = async (data: { title: string; content: string }) => {
    const response = await dashboardApi.sendQuest(data);
    return response.data;
  };

  const handleNewInquiry = () => {
    setTitle('');
    setContent('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">문의가 접수되었습니다</h1>
            <p className="text-muted-foreground">
              빠른 시일 내에 확인 하겠습니다.
            </p>
          </div>
          <Button onClick={handleNewInquiry}>
            새로운 문의하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">문의하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            제목
          </label>
          <Input
            id="title"
            type="text"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            내용
          </label>
          <textarea
            id="content"
            placeholder="문의 내용을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
            className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '전송 중...' : '문의하기'}
        </Button>
      </form>
    </div>
  );
}

export default QuestMain;