
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // 필요한 환경 변수를 추가할 수 있습니다.
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
