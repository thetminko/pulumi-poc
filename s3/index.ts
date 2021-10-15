import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket('my-bucket', {
  website: {
    indexDocument: 'index.html'
  }
});

// Export the name of the bucket
export const bucketName = bucket.id;

new aws.s3.BucketObject('test.html', {
  bucket: bucket.id,
  source: new pulumi.asset.FileAsset('./s3Files/index.html')
});
