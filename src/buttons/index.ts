import type { Button } from '../types';
import { deleteLTButton } from './deleteLTButton';
import { readyLTButton } from './readyLTButton';
import { unreadyLTButton } from './unreadyLTButtons';


const buttons: Button[] = [
    deleteLTButton,
    readyLTButton,
    unreadyLTButton
];

export default buttons;