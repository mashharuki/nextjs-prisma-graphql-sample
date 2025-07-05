import { signIn, signOut, useSession } from 'next-auth/react'

import { TodoList } from '@/components/TodoList'

/**
 * メインページコンポーネント
 * 
 * ユーザーの認証状態に基づいて異なるUIを表示する。
 * - 認証済みの場合：ユーザー情報、サインアウトボタン、TodoListを表示
 * - 未認証の場合：サインインボタンを表示
 * 
 * @returns {JSX.Element} 認証状態に応じたUIコンポーネント
 */
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="container mx-auto p-4">
        Signed in as {session.user?.email} <br />
        <button className="p-3 bg-gray-300" onClick={() => signOut()}>
          Sign out
        </button>
        <TodoList />
      </div>
    )
  }
  return (
    <div className="container mx-auto p-4">
      Not signed in <br />
      <button className="p-3 bg-gray-300" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  )
}
