export interface ArbitagePath{
    maxPath: string;
    pathArray: Array<PathValue>;
}
export interface PathValue{
    currency: string;
    rate: string;
}