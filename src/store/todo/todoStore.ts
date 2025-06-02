// 기존 컴포넌트들과의 호환성을 위해 통합된 인터페이스 제공
import { useTodoStateStore } from './stateStore';
import { useTodoActionStore } from './actionStore';
import { TodoState } from './typeStore';

// 통합된 hook - 기존 컴포넌트들이 계속 사용할 수 있도록
export const useTodoStore = <T = TodoState>(
  selector?: (state: TodoState) => T,
): T => {
  const stateStore = useTodoStateStore();
  const actionStore = useTodoActionStore();

  const combinedState = {
    ...stateStore,
    ...actionStore,
  } as TodoState;

  // selector가 없으면 전체 결합된 객체 반환
  if (!selector) {
    return combinedState as T;
  }

  // selector가 있으면 결합된 객체에 적용
  return selector(combinedState);
};

// getState 메서드 추가
useTodoStore.getState = (): TodoState => {
  const stateStore = useTodoStateStore.getState();
  const actionStore = useTodoActionStore.getState();

  return {
    ...stateStore,
    ...actionStore,
  } as TodoState;
};

// 각각의 store도 export (필요시 직접 사용 가능)
export { useTodoStateStore } from './stateStore';
export { useTodoActionStore } from './actionStore';
export type { ProcessedTodos } from './typeStore';
