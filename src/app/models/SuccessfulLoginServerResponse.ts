export class SuccessfulLoginServerResponse {
  public constructor(
    public token?: string,
    public userType?: string,
    public firstName?: string,
    public userId?: number
  ) { }

}
