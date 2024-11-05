import type React from 'react';

import type { ArtistDetailType, ArtistListType, ArtistDisciplineType } from './ArtistDetailType';

export interface AddArtistComponentProps {
  artistFormData: ArtistDetailType | undefined;
  row: ArtistListType | undefined;
  styleFormData: ArtistDisciplineType | undefined;
  setArtistFormData: React.Dispatch<React.SetStateAction<any>>;
  tabState: any[];
  setTabState: React.Dispatch<React.SetStateAction<any>>;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}
