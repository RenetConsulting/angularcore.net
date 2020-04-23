/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
export type MapPick<T, K extends keyof T, R> = {
    [P in K]: R;
};