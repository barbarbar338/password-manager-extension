declare module "api-types" {
    export interface APIRes {
        message?: string;
        [property: string]: unknown;
    }
}
