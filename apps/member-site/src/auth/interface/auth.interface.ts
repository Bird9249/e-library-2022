interface PayloadAuth {
  id: number;
  username: string;
  libraryId: number;
  permissions: Array<string>;
}

export { PayloadAuth };
