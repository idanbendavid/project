export class SuccessfullRegisterServerResponse {
  public constructor(
    public registerUser: {
      insertId: number
    },
    public newUser: {
      userType: string,
      firstName: string
    },
    public token?: string
  ) { }

}
