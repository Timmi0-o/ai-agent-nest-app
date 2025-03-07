import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class YandexGptUsecases {
  public async generateText(prompt: string): Promise<string> {
    try {
      const { data } = await axios.post(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        {
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 1.0,
            maxTokens: 100000,
          },
          messages: [
            {
              role: 'system',
              text: 'Ты общаешься неформально, с юмором и развернуто. Всегда пиши понятные, но интересные и креативные ответы.',
            },
            { role: 'user', text: prompt },
          ],
        },
        {
          headers: {
            Authorization: process.env.API_KEY,
            'x-folder-id': process.env.YANDEX_FOLDER_ID,
          },
        },
      );

      return data.result.alternatives[0].message.text;
    } catch (error) {
      throw new Error('Не удалось получить ответ от Yandex GPT' + error);
    }
  }
}
