export interface AlertResponse {
  status: "success" | "error" | "warning" | "info";
  message: any;
}

export type DeleteResponse = AlertResponse;
