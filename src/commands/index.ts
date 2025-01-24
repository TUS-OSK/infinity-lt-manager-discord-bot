import type { Command } from '../types';
import { notifyNextLTsCommand } from './notifyNextLTsCommand';
import { registerLTCommand } from './registerLTCommand';
import { startLTsCommand } from './startLTCommand';

const commands: Command[] = [
    registerLTCommand,
    notifyNextLTsCommand,
    startLTsCommand,
];

export default commands;
