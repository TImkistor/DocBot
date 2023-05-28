interface IMessage {
    sync_id: string;
    attachments: {
        data: {
            content: string;
            file_name: string;
        };
        type: "document" | string;
    }[];
    from: {
        user_huid: string;
    };
    command: {
        body: string;
    };
}
export type { IMessage };
