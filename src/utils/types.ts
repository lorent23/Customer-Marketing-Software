export interface UserAttributes {
  id: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
  roleId?: number;
  isVerified: boolean;
}
export interface RoleAttributes {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}
export interface CompanyAttributes {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}
export interface userDataAttributes{
  sessionid: string;
  timestamp: number;
  href: string;
  action: string;
  architecture: string;
  model: string;
  platform: string;
  fullVersionList: Array<String>;
  query?: string;
  preUrl: string;
}
export interface ipDataAttributes{
  query: string,
  continent: string,
  continentCode: string,
  country: string,
  countryCode: string,
  region: string,
  regionName: string,
  city: string,
  district: string,
  zip: string,
  lat: number,
  lon: number,
  timezone: string,
  currency: string,
  isp: string,
  org: string,
  as: string,
  asname: string,
  proxy: boolean,
  hosting: boolean
}