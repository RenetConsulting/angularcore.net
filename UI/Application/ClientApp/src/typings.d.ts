/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
type MapPick<T, K extends keyof T, R> = {
    [P in K]: R;
};