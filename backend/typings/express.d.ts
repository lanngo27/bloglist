declare namespace Express {
  interface Request {
    user: {
      save(): unknown
      _id: string
      blogs: Object[]
    }
    token: string
  }
}
