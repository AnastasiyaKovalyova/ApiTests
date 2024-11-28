import * as dotenv from 'dotenv'

dotenv.config()

const baseUrl = process.env.BASE_URL || 'https://li.quest/v1'

export const tokens = {
  get: `${baseUrl}/tokens`,
}

export const tools = {
  get: `${baseUrl}/tools`,
}
