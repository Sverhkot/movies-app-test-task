import { useSelector } from 'react-redux'
import { RootState } from './app/store'
import { RegisterForm } from './features/auth/RegisterForm'
import MoviesList from './features/movies/MoviesList'

export function App() {
  const token = useSelector((state: RootState) => state.auth.token)

  return <div>{token ? <MoviesList /> : <RegisterForm />}</div>
}
