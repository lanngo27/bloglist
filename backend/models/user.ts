import { Schema, Document, model } from 'mongoose'
import { IBlog } from './blog'

export interface IUser extends Document {
  username: string
  name: string
  passwordHash: string
  blogs: IBlog['_id'][]
}

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
    required: true
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

export default model<IUser>('User', userSchema)
