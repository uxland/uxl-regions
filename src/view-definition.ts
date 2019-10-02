import { IRegion } from './region';

export type ViewFactory = () => Promise<HTMLElement>;
export interface ViewDefinition {
  htmlTag?: string;
  htmlUrl?: string;
  factory?: ViewFactory;
  element?: HTMLElement;
  options?: any;
  isDefault?: boolean;
  removeFromDomWhenDeactivated?: boolean;
  sortHint?: string;
  route?: string;
}
export interface ViewComponent {
  view: ViewDefinition;
  viewKey: string;
  region: IRegion;
  active: boolean;
}
