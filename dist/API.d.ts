declare class API {
    private readonly _apiUrl;
    private readonly _botId;
    private readonly _secretKey;
    private _token;
    constructor({ botId, secretKey, apiUrl }: {
        botId: string;
        secretKey: string;
        apiUrl: string;
    });
    updateToken(): Promise<void>;
    call<T>(method: "GET" | "POST", url: string, payload: unknown): Promise<T>;
}
export default API;
