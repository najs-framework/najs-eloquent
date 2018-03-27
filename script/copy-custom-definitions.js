#!/usr/bin/env node
const FileSystem = require('fs')
const Path = require('path')

const cwd = Path.resolve(__dirname, '..')
const distBase = 'dist'

const files = [
  ['lib', 'model', 'Eloquent.d.ts'],
  ['lib', 'model', 'spec', 'Base.d.ts'],
  ['lib', 'model', 'spec', 'EloquentModel.d.ts'],
  ['lib', 'model', 'spec', 'MongooseDefinition.d.ts'],
  ['lib', 'model', 'spec', 'MongooseMembers.d.ts'],
  ['lib', 'model', 'spec', 'MongooseStaticQuery.d.ts'],
  ['lib', 'model', 'spec', 'Query.d.ts']
]

console.log('Start writing custom definitions...')
for (const file of files) {
  const source = Path.join(cwd, ...file)
  const destination = Path.join(cwd, distBase, ...file)

  if (FileSystem.existsSync(destination)) {
    FileSystem.unlinkSync(destination)
  }

  if (!FileSystem.existsSync(Path.dirname(destination))) {
    FileSystem.mkdirSync(Path.dirname(destination))
  }

  console.log('  Copy:', source, '->', destination)
  FileSystem.copyFileSync(source, destination)
}
console.log('Done write custom definitions.')
