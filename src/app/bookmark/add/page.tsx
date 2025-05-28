import { redirect } from 'next/navigation';

// NOTE : /bookmark/add 경로는 모달로만 사용하므로, url로 직접 접근하면 모달을 사용하는 페이지인 홈으로 리다이렉트합니다.
const AddMemoPage = () => {
  redirect('/');
  return null;
};

export default AddMemoPage;
