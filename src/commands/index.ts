import type { Command } from '../types';
import { notifyNextLTsCommand } from './notifyNextLTsCommand';
import { registerLTCommand } from './registerLTCommand';
import { startLTsCommand } from './startLTCommand';
import { editLTCommand } from './editLTCommand';

const commands: Command[] = [
    registerLTCommand,
    notifyNextLTsCommand,
    startLTsCommand,
    editLTCommand,
];

export default commands;
