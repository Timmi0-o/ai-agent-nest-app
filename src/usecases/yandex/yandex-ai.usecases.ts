import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { YandexMessageType } from 'src/infrastructure/types/yandex/yandex-message.types';
import { Readable } from 'stream';

@Injectable()
export class YandexGptUsecases {
  private YANDEX_REQUEST_URL = process.env.YANDEX_REQUEST_URL || '';
  private YANDEX_MAX_HISTORY_LENGTH = Number(
    process.env.YANDEX_MAX_HISTORY_LENGTH,
  );
  private chatHistory: YandexMessageType[] = [];

  public async generateText(prompt: string): Promise<string> {
    try {
      this.chatHistory.push({ role: 'user', text: prompt });
      if (this.chatHistory.length > this.YANDEX_MAX_HISTORY_LENGTH) {
        this.chatHistory = this.chatHistory.slice(
          -this.YANDEX_MAX_HISTORY_LENGTH,
        );
      }

      const { data } = await axios.post(
        this.YANDEX_REQUEST_URL,
        {
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 1.0,
            maxTokens: 4000,
          },
          messages: [
            {
              role: 'system',
              text: 'Отвечай всегда развернуто и в том стиле, что и твой собеседник',
            },
            ...this.chatHistory,
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

      const responseText = data.result.alternatives[0].message.text;

      this.chatHistory.push(
        { role: 'user', text: responseText },
        { role: 'user', text: prompt },
      );

      return responseText;
    } catch (error) {
      throw new Error('Не удалось получить ответ от Yandex GPT' + error);
    }
  }

  public async generateTextStream(prompt: string): Promise<Readable> {
    console.log('prompt', prompt);

    const response = await axios.post(
      this.YANDEX_REQUEST_URL,
      {
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
        completionOptions: {
          stream: true,
          temperature: 1.0,
          maxTokens: 4000,
        },
        messages: [
          {
            role: 'system',
            text: 'Ты будешь персонажем, данные которого тебе скинул, нужно писать от первого лица, т.е от лица этого персонажа, как будто ты что то рассказываешь людям',
          },
          { role: 'user', text: prompt },
        ],
      },
      {
        headers: {
          Authorization: process.env.API_KEY,
          'x-folder-id': process.env.YANDEX_FOLDER_ID,
        },
        responseType: 'stream',
      },
    );

    const stream = new Readable({
      read() {},
    });

    let fullResponse = '';

    const receivedParts = new Set<string>();

    response.data.on('data', (chunk: Buffer) => {
      try {
        const lines = chunk.toString().split('\n').filter(Boolean);

        for (const line of lines) {
          const parsed = JSON.parse(line);
          const textPart = parsed.result.alternatives?.[0]?.message?.text;

          if (textPart && !receivedParts.has(textPart)) {
            receivedParts.add(textPart);
            stream.push(textPart);
            fullResponse += textPart;
          }
        }
      } catch (err) {
        console.error('Ошибка парсинга чанка:', err);
      }
    });

    response.data.on('end', () => {
      this.chatHistory.push({ role: 'user', text: prompt });
      this.chatHistory.push({ role: 'system', text: fullResponse });
      stream.push(null);
    });

    response.data.on('error', (err: any) => {
      stream.destroy(err);
    });

    return stream;
  }
}
