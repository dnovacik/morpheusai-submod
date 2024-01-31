import { ipcMain } from 'electron';
import { Ollama, ProgressResponse } from 'ollama';
import path from 'path';
import os from 'os';
import { isDev } from '..';

// events
import { IpcMainChannel, OllamaChannel } from '../../events';
import { executeCommandElevated, runDelayed } from './system';

// constants
const DEFAULT_OLLAMA_URL = 'http://127.0.0.1:11434/';

// commands
export const SERVE_OLLAMA_CMD = 'ollama serve';
export const WSL_SERVE_OLLAMA_CMD = 'wsl ollama serve';

// ollama instance
let ollama: Ollama = null;

export const loadOllama = async (): Promise<boolean> => {
  let runningInstance = await isOllamaInstanceRunning();

  if (runningInstance.isRunning) {
    ipcMain.emit(OllamaChannel.OllamaStatusUpdate, `Local instance of ollama is running and connected at ${runningInstance.url}`);

    // connect to local instance
    ollama = new Ollama({
      host: runningInstance.url
    });

    return true;
  }

  runningInstance = await tryLocalOllamaSpawn();

  if (runningInstance.isRunning) {
    ipcMain.emit(OllamaChannel.OllamaStatusUpdate, `Local instance of ollama is running and connected at ${runningInstance.url}`);

    // connect to local instance
    ollama = new Ollama({
      host: runningInstance.url
    });

    return true; 
  }

  ipcMain.emit(IpcMainChannel.Error, `Couldn't start Ollama locally.`);

  return false;
};

export const isOllamaInstanceRunning = async (url?: string): Promise<{ isRunning: boolean, url?: string }> => {
  try {
    const usedUrl = url ?? DEFAULT_OLLAMA_URL;
    const ping = await fetch(usedUrl);

    return ping.status === 200
      ? { isRunning: true, url: usedUrl }
      : { isRunning: false };
  } catch (err) {
    return { isRunning: false }
  }
};

export const tryLocalOllamaSpawn = async () => {
  const command = isDev()
    ? WSL_SERVE_OLLAMA_CMD
    : SERVE_OLLAMA_CMD;

    try {
      executeCommandElevated(command)
    } catch (err) {
      console.log(err);
    }

    return await runDelayed(isOllamaInstanceRunning);
};

export const getOllamaExecutableAndAppDataPath = (): { executable: string, appDataPath: string } => {
  switch (process.platform) {
    case 'win32':
      return {
        executable: 'ollama.exe',
        appDataPath: path.join(os.homedir(), "AppData", "Local", "MorpheusAI", "SubMod")
      };
    case 'darwin':
      return {
        executable: 'ollama-darwin',
        appDataPath: path.join(os.homedir(), "Library", "Application Support", "MorpheusAI", "SubMod")
      };
    case 'linux':
      return {
        executable: 'ollama-linux',
        appDataPath: path.join(os.homedir(), ".config", "MorpheusAI", "SubMod")
      };
    default:
      throw new Error(`Unsupported platform detected: ${process.platform}`);
  }
};

export const askOllama = async (model: string, message: string) => {
  return await ollama.chat({
    model,
    messages: [
      {
        role: 'user',
        content: `${message}`
      }
    ]
  });
};

export const installModelWithStatus = async (model: string) => {
  return await ollama.pull({
    model,
    stream: true
  });
};

export const getAllLocalModels = async () => {
  return await ollama.list();
};

export const consumeStream = async (stream: AsyncGenerator<ProgressResponse, any, unknown>) => {
  for await (const part of stream) {
    if (part.digest) {
      let percent = 0;

      if (part.completed && part.total) {
        percent = Math.round((part.completed / part.total) * 100);

        return `${part.status} ${percent}%`;
      }
    } else {
      return part.status;
    }
  }
};