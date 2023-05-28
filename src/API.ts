// Импорт необходимых модулей
import axios from "axios";
import CryptoJS, { HmacSHA256 } from "crypto-js";

// Объявление класса API
class API {
    // Приватные свойства класса
    private readonly _apiUrl: string;
    private readonly _botId: string;
    private readonly _secretKey: string;
    private _token: string | null;

    // Конструктор класса
    constructor({
        botId,
        secretKey,
        apiUrl
    }: {
    botId: string;
    secretKey: string;
    apiUrl: string;
}) {
        this._botId = botId;
        this._secretKey = secretKey;
        this._apiUrl = apiUrl;

        this._token = null;
    }

    // Обновление токена
    public async updateToken(): Promise<void> {
        const response = await axios.get<{ result: string }>(`${this._apiUrl}/api/v2/botx/bots/${this._botId}/token`, {
            params: {
            // Формирование подписи запроса
                signature: HmacSHA256(this._botId, this._secretKey).toString(CryptoJS.enc.Hex).toUpperCase()
            }
        });

        this._token = response.data.result;
    }

    // Выполнение запроса
    public async call<T>(method: "GET" | "POST", url: string, payload: unknown): Promise<T> {
        if (!this._token) {
            throw new Error("Token not set");
        }

        const response = await axios({
            url: `${this._apiUrl}${url}`,
            method,
            headers: {
                Authorization: `Bearer ${this._token}`
            },
            data: payload
        });

        return response.data as T;
    }
}

// Экспорт класса API по умолчанию
export default API;
