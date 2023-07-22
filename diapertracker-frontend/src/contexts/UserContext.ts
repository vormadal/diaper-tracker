import { createContext } from 'react'
import { IUserProfile, UserProfile } from '../api/ApiClient'

export default createContext<[IUserProfile, () => void]>([new UserProfile(), () => {}])
