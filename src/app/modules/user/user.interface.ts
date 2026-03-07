
export interface IUser {
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  profileImage: string
  isBlocked: boolean
  isDeleted: boolean
}

export interface ILogin {
  email: string
  password: string
}

export interface IChangePassowrd {
  oldPassword: string
  newPassword: string
}



