export interface OrganizationSettings {
  organizationId: string;
  name: string;
  idno: string;
}

export interface UpdateOrganizationRequest {
  name: string;
  idno: string;
}
