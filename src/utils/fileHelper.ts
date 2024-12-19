import fs from 'fs-extra';
import { Status } from '../types';

export const readData = async (filePath: string): Promise<Status[]> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Status[];
  } catch (error) {
    throw new Error('Failed to read data from file');
  }
};

export const writeData = async (filePath: string, data: Status[]): Promise<void> => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Failed to write data to file');
  }
};
