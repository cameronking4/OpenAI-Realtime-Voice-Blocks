interface Message {
    role: string;
    text: string;
    timestamp: string;
    isFinal: boolean;
}

export type { Message };