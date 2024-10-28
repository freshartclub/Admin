import type React from 'react';

import type { ArtistDetailType, ArtistListType } from './ArtistDetailType';

export interface AddArtistComponentProps {
  artistFormData: ArtistDetailType | undefined;
  row: ArtistListType | undefined;
  setArtistFormData: React.Dispatch<React.SetStateAction<any>>;
  tabState: any[];
  setTabState: React.Dispatch<React.SetStateAction<any>>;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}
