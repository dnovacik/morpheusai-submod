import checkDiskSpace from 'check-disk-space';
import { ipcMain } from 'electron';
import isElevated from 'native-is-elevated';
import sudo from 'sudo-prompt';
import { IpcMainChannel } from '../../events';

export const isElevatedProcess = () => {
  return isElevated();
};

export const hasEnoughSpace = async (url: string, sizeInBytes: number) => {
  const diskSpace = await checkDiskSpace(url);

  return diskSpace.free > sizeInBytes;
};

export const executeCommandElevated = (command: string) => {
  const options = {
    name: 'MorpheusAI SubMod',
    icns: './../logo_white.ico'
  };

  sudo.exec(command, options, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }

    ipcMain.emit(IpcMainChannel.CommandOuput, stdout.toString());
  })
};

export const runDelayed = async <T>(handler: () => Promise<T>, delayInMs = 3000) => {
  return new Promise(resolve => setTimeout(resolve, delayInMs)).then(handler);
}