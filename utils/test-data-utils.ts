import fs from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker'

export class TestData {
  static async generateQueryParams(
    count: number,
  ): Promise<Record<string, string>> {
    return new Promise((resolve) => {
      const params = Object.fromEntries(
        Array.from({ length: count }, () => [
          faker.word.noun(), // Random word for key
          faker.word.adjective(), // Random number for value
        ]),
      )
      resolve(params)
    })
  }

  static loadJSON(filePath: string): any {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, `../data/${filePath}`),
        'utf8',
      )
      return JSON.parse(data)
    } catch (error) {
      throw new Error(
        `Error loading test data from ${filePath}: ${error.message}`,
      )
    }
  }

  // @todo update this function and class to be used in the tests and to be env-specific
  static loadEnvSpecificJSON(fileName: string, env: string): any {
    const envFilePath = path.resolve(__dirname, `../data/${env}/${fileName}`)
    return TestData.loadJSON(envFilePath)
  }
}
