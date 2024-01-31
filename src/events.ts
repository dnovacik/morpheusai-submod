export enum IpcChannel {
  AppInit = 'app:init',
}

export enum OllamaChannel {
  OllamaInit = 'ollama:init',
  OllamaStatusUpdate = 'ollama:status',
  OllamaGetAllModels = 'ollama:getallmodels',
  OllamaQuestion = 'ollama:question',
  OllamaAnswer = 'ollama:answer'
}

export enum IpcMainChannel {
  Error = 'main:error',
  CommandOuput = 'command:output'
}