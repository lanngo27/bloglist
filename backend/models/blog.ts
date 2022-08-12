import { Schema, Document, model } from 'mongoose'
import { IUser } from './user'

export interface IBlog extends Document {
  title: string
  author: string
  url: string
  likes: number
  user: IUser['_id']
  comments: string[]
}

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: String
    }
  ]
})

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default model<IBlog>('Blog', blogSchema)
