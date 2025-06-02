import { useTodoStore } from '@/store/todo/todo-store';

interface StatusUIProps {
  type: 'loading' | 'error';
}

const StatusUI = ({ type }: StatusUIProps) => {
  if (type === 'loading') {
    return (
      <div className="todo-page">
        <div className="todo-loading">
          <div className="loading-spinner"></div>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="todo-text">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="todo-page">
        <div className="todo-error">
          <div className="todo-error-icon">⚠️</div>
          <p className="todo-text todo-status-message">
            데이터를 불러오는 데 실패했습니다.
          </p>
          <button
            onClick={() => useTodoStore.getState().fetchAll()}
            className="todo-retry-button"
          >
            🔄 다시 시도
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusUI;
