export {};

declare global {
    interface Window {
        FloatingInbox: {
            open: () => void;
            close: () => void;
        };
    }
}
