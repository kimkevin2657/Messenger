export interface IPreference {
  hideWalkthrough: boolean;
  autoReply: boolean;
  language: string;
  uid: string;
  messagePreview: boolean;
  inAppNotifications: boolean;
  showBanner?: boolean;
  vibration?: boolean;
}

export interface ISetting {
  title: string;
  open: boolean;
  items: Array<{
    text: string;
    icon: string;
    selected?: boolean;
    description?: string;
    checkbox?: boolean;
    event?: (data: any) => void;
  }>;
}
