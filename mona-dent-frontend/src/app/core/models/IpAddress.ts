export interface IpAddress {
  id: string;
  name: string;
  address: string;
}

export interface CreateIpAddressRequest {
  name: string;
  address: string;
}

export interface UpdateIpAddressRequest {
  name: string;
}
