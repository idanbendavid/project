export class SuccessfulTokenVerificationServerResponse{
  public constructor(
      public userType?:string,
      public userId?: number,
      public firstName?: string
  ){}

}
