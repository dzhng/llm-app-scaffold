import { AnthropicChatApi, ChatRequestMessage, OpenAIChatApi } from 'llm-api';
import { partial } from 'lodash';
import { z } from 'zod';
import { chat, completion, RequestOptions, Response } from 'zod-gpt';

type Completion = <T extends z.ZodType = z.ZodString>(
  prompt: string | (() => string),
  opt?: Partial<RequestOptions<T>>,
) => Promise<Response<T>>;

type Chat = <T extends z.ZodType = z.ZodString>(
  messages: ChatRequestMessage[],
  opt?: Partial<RequestOptions<T>>,
) => Promise<Response<T>>;

export const gpt3 = new OpenAIChatApi(
  {
    apiKey: process.env.AZURE_OPENAI_KEY!,
    azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    azureDeployment: 'gpt-35-16k',
  },
  { temperature: 0, contextSize: 16_000 },
);
export const gpt3Completion: Completion = partial(completion, gpt3);
export const gpt3Chat: Chat = partial(chat, gpt3);

export const gpt4 = new OpenAIChatApi(
  {
    apiKey: process.env.OPENAI_KEY!,
  },
  // context size is technically 127793 tokens, but leave some room for margins
  { model: 'gpt-4o', temperature: 0, contextSize: 120_000 },
);
export const gpt4Completion: Completion = partial(completion, gpt4);
export const gpt4Chat: Chat = partial(chat, gpt4);

// NOTE: anthropic's model's context size is actually 200k, but do less because we're using the wrong tokenizer (tiktoken) to measure context size, and we don't want to pay too much for large context.

export const haiku = new AnthropicChatApi(
  {
    apiKey: process.env.ANTHROPIC_KEY!,
  },
  {
    model: 'claude-3-haiku-20240307',
    stream: true,
    temperature: 0,
    contextSize: 160_000,
  },
);
export const haikuCompletion: Completion = partial(completion, haiku);
export const haikuChat: Chat = partial(chat, haiku);

export const sonnet = new AnthropicChatApi(
  {
    apiKey: process.env.ANTHROPIC_KEY!,
  },
  {
    model: 'claude-3-sonnet-20240229',
    stream: true,
    temperature: 0,
    contextSize: 160_000,
  },
);
export const sonnetCompletion: Completion = partial(completion, sonnet);
export const sonnetChat: Chat = partial(chat, sonnet);

export const opus = new AnthropicChatApi(
  {
    apiKey: process.env.ANTHROPIC_KEY!,
  },
  {
    model: 'claude-3-opus-20240229',
    stream: true,
    temperature: 0,
    contextSize: 160_000,
  },
);
export const opusCompletion: Completion = partial(completion, opus);
export const opusChat: Chat = partial(chat, opus);
