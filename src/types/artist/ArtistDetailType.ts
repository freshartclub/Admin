export interface ArtistDetailType {
  name: string;
  About: string;
  ArtworkModule: string;
  accountId: string;
  artistName: string;
  artistSurname1: string;
  artistSurname2: string;
  highlights: string;
  cvData: cvData[];
  insignia: [];

  nickName?: string;
  ArtistId: string;
  country?: object | null;
  createDate?: string;
  language: string[];
  zipCode: string;
  city: string;
  state: string;
  residentialAddress: string;
  phone: string;
  email: string;
  gender: string;
  notes?: string;
  ProductStatus: string;
  year: string;
  about: string;
  ArtistCategory: ArtistCategory[];
  discipline: [];
  Type: string;
  taxNumber: string;
  taxLegalName: string;
  taxAddress: string;
  taxZipCode: string;
  taxCity: string;
  taxProvince: string;
  taxCountry?: object | null;
  taxEmail: string;
  taxPhone: string;
  taxBankIBAN: string;
  taxBankName: string;
  CustomOrder: string;
  PublishingCatalog: string;
  ArtistFees: string;
  artistLevel: string;
  artProvider: string;
  ArtistPlus?: string;
  MinNumberOfArtwork: string;
  MaxNumberOfArtwork: string;
  Description: string;
  Location?: string;
  Scope?: string;
  logName: string;
  logAddress: string;
  logZipCode: string;
  logCity: string;
  logProvince: string;
  logCountry?: object | null;
  managerArtistName: string;
  managerArtistSurnameOther1: string;
  documentName: String;
  uploadDocs: any[];
  profileImage: any;
  additionalImage: any[];
  inProcessImage: any;
  mainVideo: any;
  additionalVideo: any[];
  managerExtraInfo1: String;
  managerExtraInfo2: String;
  managerExtraInfo3: String;
  managerArtistSurname1: string;
  managerArtistSurname2?: string;
  managerArtistNickname?: string;
  managerArtistContactTo?: string;
  managerArtistPhone: string;
  managerArtistEmail: string;
  address: string;
  managerZipCode: string;
  managerCity: string;
  managerState: string;
  managerCountry: string;
  managerArtistLanguage: string[];
  managerArtistGender: string;
  logEmail: string;
  logPhone: string;
  logNotes?: string;
  link: [];

  //-----artsistlist-----
  _id: any;
  uploadImage: any;
  profile: any;
  artistId: string;
  isActivated: Boolean;
  createdAt: string;
  userId: string;
}

interface cvData {
  year: string;
  Type: string;
  Description: string;
  Location?: string;
  Scope?: string;
}

interface ArtistCategory {
  catagoryone: string;
  styleone: string;
  styletwo: string;
}

export interface ArtistListType {
  _id: string;
  avatar: string;
  isActivated: Boolean;
  userId?: string;
  artistId: string;
  artistName: string;
  artistSurname1: string;
  artistSurname2: string;
  uploadImage: any;
  profile: any;
  email: string;
  phone: string;
  createdAt: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface ArtistDisciplineType {
  disciplineImage: any;
  _id: string;
  mediaName: string;
  disciplineSpanishName: string;
  disciplineDescription: string;
  spanishMediaName: string;
  disciplineName: string;
  styleName: string;
  spanishStyleName: string;
  technicName: string;
  spanishTechnicName: string;
  themeName: string;
  spanishThemeName: string;
  createdAt: string;
  description: string;
  name: string;
  spanishName: string;
  discipline: Array<string>;
  isDeleted: Boolean;
  insigniaImage: any;
  credentialName: string;
  credentialPriority: string;
  credentialGroup: string;
  isActive: Boolean;
}
