#!/usr/bin/env node
const FileSystem = require('fs')
const Path = require('path')

const cwd = Path.resolve(__dirname, '..')
const distBase = 'dist'

const files = []

console.log('Start writing custom definitions...')
for (const file of files) {
  const source = Path.join(cwd, ...file)
  const destination = Path.join(cwd, distBase, ...file)

  if (FileSystem.existsSync(destination)) {
    FileSystem.unlinkSync(destination)
  }

  console.log('  Copy:', source, '->', destination)
  FileSystem.copyFileSync(source, destination)
}
console.log('Done write custom definitions.')
