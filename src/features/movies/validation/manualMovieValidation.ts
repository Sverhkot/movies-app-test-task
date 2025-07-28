import type { Movie } from '../apiSlice'

export const validateTitle = (
  value: string,
  movies?: Pick<Movie, 'title'>[]
): string => {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return 'Title field cannot be empty or only spaces'
  }

  const isDuplicate = movies?.some(
    movie => movie.title.trim().toLowerCase() === trimmedValue.toLowerCase()
  )
  
  if (isDuplicate) {
    return 'Movie with this title already exists'
  }

  return ''
}

export const validateYear = (value: string): string => {
  const numericValue = Number(value)

  if (
    value !== '' &&
    (isNaN(numericValue) || numericValue < 1900 || numericValue > 2021)
  ) {
    return 'Year must be between 1900 and 2021'
  }

  return ''
}

export const validateActors = (value: string): string => {
  const trimmedValue = value.trim()

  if (trimmedValue === '') {
    return 'Actors field cannot be empty or only spaces'
  }

  if (!/[a-zA-Zа-яА-ЯёЁ]/.test(trimmedValue)) {
    return 'Actors field must contain at least one letter'
  }

  if (/[^a-zA-Zа-яА-ЯёЁ\s,.-]/.test(value)) {
    return 'Only letters, commas, dots, spaces and hyphens are allowed'
  }

  return ''
}
