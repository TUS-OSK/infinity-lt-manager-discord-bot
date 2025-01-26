import type { Button } from '../types';
import { deleteLTButton } from './deleteLTButton';
import { moveNextLTButton } from './moveNextLTButton';
import { readyLTButton } from './readyLTButton';
import { unreadyLTButton } from './unreadyLTButtons';


const buttons: Button[] = [
    deleteLTButton,
    readyLTButton,
    unreadyLTButton,
    moveNextLTButton,
];

export default buttons;