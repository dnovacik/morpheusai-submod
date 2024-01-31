import { contextBridge, ipcRenderer } from "electron";
import { ChatResponse, ListResponse } from "ollama";
import { IpcChannel, OllamaChannel } from "../events";

contextBridge.exposeInMainWorld('backendBridge', {
  main: {
    init: () => invokeNoParam<boolean>(IpcChannel.AppInit),
    onInit: (callback: (result: boolean) => void) => ipcRenderer.on(IpcChannel.AppInit, (_, value: boolean) => callback(value))
  },
  ollama: {
    onStatusUpdate: (callback: (status: string) => void) => ipcRenderer.on(OllamaChannel.OllamaStatusUpdate, (_, status) => callback(status)),
    question: (question: string) => ipcRenderer.invoke(OllamaChannel.OllamaQuestion, question),
    onAnswer: (callback: (response: ChatResponse) => void) => ipcRenderer.on(OllamaChannel.OllamaAnswer, (_, response) => callback(response)),
    getAllModels: () => invokeNoParam<ListResponse>(OllamaChannel.OllamaGetAllModels)
  },
  removeAllListeners(channel: string) {
    ipcRenderer.removeAllListeners(channel);
  }
});

function invoke<P extends any[], R>(channel: string, ...args: P) {
  return ipcRenderer.invoke(channel, ...args) as Promise<R>
};

function invokeNoParam<R>(channel: string, ...args: any[]) {
  return ipcRenderer.invoke(channel, ...args) as Promise<R>
}