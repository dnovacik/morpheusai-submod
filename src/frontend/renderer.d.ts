export interface BackendBridge {
  main: {
    init: () => Promise<boolean>;
    onInit: (callback: (result: boolean) => void) => Electron.IpcRenderer;
  },
  ollama: {
    onStatusUpdate: (callback: (status: string) => void) => Electron.IpcRenderer;
    question: ({ model, question }: OllamaQuestion) => void;
    onAnswer: (callback: (response: ChatResponse) => void) => Electron.IpcRenderer;
    getAllModels: () => Promise<ListResponse>;
  },
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    backendBridge: BackendBridge;
  }
}

