import { Request, Response, NextFunction } from 'express';
import { readData, writeData } from '../utils/fileHelper';
import path from "path";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { Status } from '../types';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const Status_FILE = path.join(__dirname, "../../data/status.json");

function limit(string: string = '', limit: number = 0): string {
  if (typeof string !== 'string' || string.length === 0 || limit <= 0) {
    return '';
  }

  if (limit >= string.length) {
    return string;
  }

  return string.substring(0, limit) + '...';
}

export const getAllstatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status: Status[] = await readData(Status_FILE);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

export const getStatusById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const status: Status[] = await readData(Status_FILE);
    const Status = status.find((q: Status) => q.id === parseInt(id, 10));

    if (!Status) {
      res.status(404).json({ error: 'Status not found' });
      return;
    }

    res.status(200).json(Status);
  } catch (error) {
    next(error);
  }
};

export const addStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, author } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Invalid Status text' });
      return;
    }

    const StatusText = purify.sanitize(text);
    const AuthorName = purify.sanitize(author);

    const status: Status[] = await readData(Status_FILE);

    const isDuplicate = status.some((q) => q.status.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      res.status(409).json({ error: 'Duplicate Status is not allowed' });
      return;
    }

    const newStatus: Status = {
      id: status.length > 0 ? status[status.length - 1].id + 1 : 1,
      status: limit(StatusText, 500),
      author: limit(AuthorName, 50) || 'Anonymous',
    };

    status.push(newStatus);
    await writeData(Status_FILE, status);

    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};
