import { useAppSelector } from './app/hooks'
import type { RootState } from './app/store'
import { RegisterForm } from './features/auth/RegisterForm'
import MoviesList from './features/movies/MoviesList'

export function App() {
  const token = useAppSelector((state: RootState) => state.auth.token)

  return <div>{token ? <MoviesList /> : <RegisterForm />}</div>
}
