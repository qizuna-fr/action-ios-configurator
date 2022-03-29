import * as fs from 'fs'

export function readFileLinesSync(filename: string): string[] {
  const rawContent: string = fs.readFileSync(filename, 'utf8')
  const arrayContent: string[] = rawContent.split(/\r?\n/)
  return arrayContent
}

export * from 'fs'
