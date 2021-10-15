/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
// import * as pulumi from '@pulumi/pulumi';

const noOfPublicSubnets = 3;
const noOfPrivateSubnets = 3;

export const runTemplate = () => {
  // Create S3 bucket name Pulumi-Api-Tmk
  const bucket = new aws.s3.Bucket('pulumi-api-tmk', {
    versioning: {
      enabled: true,
      mfaDelete: false
    }
  });

  const vpc = new aws.ec2.Vpc('pulumi-api-tmk-vpc', {
    cidrBlock: '10.0.0.0/16',
    enableDnsSupport: true,
    enableDnsHostnames: true,
    tags: {
      Name: 'pulumi-api-tmk-vpc'
    }
  });

  const publicSubnets: aws.ec2.Subnet[] = [];
  for (let i = 0; i < noOfPublicSubnets; i++) {
    const publicSubnet = new aws.ec2.Subnet('pulumi-api-tmk-public-subnet', {
      vpcId: vpc.id,
      cidrBlock: `10.0.${i}.0/24`,
      availabilityZone: 'ap-southeast-1a'
    });

    publicSubnets.push(publicSubnet);
  }

  const privateSubnets: aws.ec2.Subnet[] = [];
  for (let i = 0; i < noOfPrivateSubnets; i++) {
    const privateSubnet = new aws.ec2.Subnet('pulumi-api-tmk-private-subnet', {
      vpcId: vpc.id,
      cidrBlock: `10.0.${i + noOfPublicSubnets}.0/24`,
      availabilityZone: 'ap-southeast-1b'
    });
    privateSubnets.push(privateSubnet);
  }

  // Create ECR
  const repo = new awsx.ecr.Repository('pulumi-api-tmk', {
    tags: {
      Name: 'pulumi-api-tmk',
      Description: 'Testing Pulumi'
    }
  });

  // Build Pulumi API image and push to ECR
  const apiImage = repo.buildAndPushImage('./template/app');

  // Create Application Load Balancer
  const listener = new awsx.lb.ApplicationListener('pulumi-api-alb-listener', {
    port: 80,
    external: true
    // defaultAction: {
    //   type: 'redirect',
    //   redirect: {
    //     statusCode: 'HTTP_301',
    //     protocol: 'HTTP',
    //     port: '3000'
    //   }
    // }
  });

  // Create ECS Task Definition
  const apiTaskDefinition = new awsx.ecs.FargateTaskDefinition('pulumi-api-task-definition', {
    memory: '512',
    containers: {
      'pulumi-api-container': {
        image: apiImage,
        portMappings: [listener]
      }
    }
  });

  // Create ECS Cluster
  const cluster = new awsx.ecs.Cluster('pulumi', {
    tags: {
      Name: 'Pulumi'
    }
  });

  // Create ECS Fargate Service
  const apiService = new awsx.ecs.FargateService('pulumi-api-service', {
    cluster: cluster,
    taskDefinition: apiTaskDefinition,
    desiredCount: 1
  });

  return listener.endpoint;
};
