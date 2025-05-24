import BookMark from '@/components/home/bookmark/book-mark';
import DevNews from '@/components/home/dev-news/dev-news';
import Memo from '@/components/home/memo/memo';
import TodoList from '@/components/home/todo-list/todo-list';
import Card from '@/components/ui/dashboard-card';
import DashboardGrid from '@/components/ui/dashboard-grid';

export default function Home() {
  return (
    <div className="p-6 bg-[#F3EFFE] min-h-fit">
      <h1>넥스트의 대시보드</h1>
      <section>
        <DashboardGrid>
          <Card>
            <TodoList />
          </Card>
          <Card>
            <BookMark />
          </Card>
          <Card>
            <Memo />
          </Card>
          <Card>
            <DevNews />
          </Card>
        </DashboardGrid>
      </section>
    </div>
  );
}
