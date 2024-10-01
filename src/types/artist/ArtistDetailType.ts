export interface ArtistDetailType {
  name: string;
  About: string;
  ArtworkModule: string;
  accountId: string;
  artistName: string;
  artistSurname1: string;
  highlights: string;
  cvData: cvData[];
  artistSurname2?: string;
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
  InternalNote?: string;
  ProductStatus: string;
  year: string;
  ArtistCategory: ArtistCategory[];
  Type: string;
  TaxNumber: string;
  TaxLegalName: string;
  TaxAddress: string;
  TaxZipCode: string;
  TaxCity: string;
  TaxProvince: string;
  TaxCountry?: object | null;
  TaxEmail: string;
  TaxPhone: string;
  BankIBAN: string;
  BankName: string;
  CustomOrder: string;
  PublishingCatalog: string;
  ArtistFees: string;
  ArtistPlus?: string;
  MinNumberOfArtwork: string;
  MaxNumberOfArtwork: string;
  Description: string;
  Location?: string;
  Scope?: string;
  LogName: string;
  LogisticAddress: string;
  LogZipCode: string;
  LogCity: string;
  LogProvince: string;
  LogCountry?: object | null;
  ManagerartistName: string;
  ManagerartistSurname1: string;
  ManagerartistSurname2?: string;
  ManagerArtworkNickname?: string;
  ContactTo?: string;
  ManagerphoneNumber: string;
  ManagerEmail: string;
  ManagerAddress: string;
  ManagerZipCode: string;
  ManagerCity: string;
  ManagerProvince: string;
  ManagerCountry: string;
  ManagerLanguage: string[];
  ManagerGender: string;
  LogEmail: string;
  LogphoneNumber: string;
  LogAdditionalNotes?: string;
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
