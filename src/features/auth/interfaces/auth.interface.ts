export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  documentType: string;
  documentNumber: string;
  phone: string;
}
