export interface Branch {
  branchId: string;
  name: string;
  address: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
}

export interface UpdateBranchRequest {
  name?: string | null;
  address?: string | null;
}
