import type { Command } from '../types';
import { notifyNextLTsCommand } from './notifyNextLTsCommand';
import { registerLTCommand } from './registerLTCommand';

const commands: Command[] = [
    registerLTCommand,
    notifyNextLTsCommand,
];

export default commands;
