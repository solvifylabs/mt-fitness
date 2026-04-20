export interface IVideoAccessPort {
  getSignedUrl(videoKey: string, userId: string, expiresInSeconds: number): Promise<string>;
  triggerTranscode(rawS3Key: string, outputPrefix: string): Promise<string>;
}
