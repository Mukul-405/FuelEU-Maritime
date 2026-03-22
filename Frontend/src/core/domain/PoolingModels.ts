export interface PoolMemberInput {
  shipId: string;
  cb: number;
}

export interface PoolMemberResult {
  ship_id: string;
  cb_before: number;
  cb_after: number;
  allocated_cb: number;
}

export interface PoolResult {
  pool_id: string;
  members: PoolMemberResult[];
}
