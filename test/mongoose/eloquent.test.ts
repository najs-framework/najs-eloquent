import 'jest'
import Eloquent from '../../lib'
import { Schema } from 'mongoose'

interface IDocument {
  category: string
}

class User extends Eloquent.Mongoose<IDocument, User>() {
  getUserName() {}

  getClassName(): string {
    return Document.className
  }

  getSchema(): Schema {
    return new Schema({})
  }
}

class Document extends Eloquent.Mongoose<IDocument, Document>() {
  static className: string = 'Document'

  getClassName(): string {
    return Document.className
  }

  getSchema(): Schema {
    return new Schema({})
  }

  getDocumentName() {}

  get doc_name(): string {
    return ''
  }
  set doc(value: string) {}
}

class Child extends Document.Class<Child>() {
  getChildName() {}

  getClassName(): string {
    return Document.className
  }

  getSchema(): Schema {
    return new Schema({})
  }
}

describe('Eloquent', function() {
  it('should work', async function() {
    const document = new Document()
    document.category = 'awesome'
    console.log(document.category)

    const test = (await Document.select().all()).first()
    const child = (await Child.select().all()).first()

    const userInstance = new User()
    userInstance.getUserName()

    const user = (await User.select().all()).first()
    user.getUserName()
  })
})
