import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const userData = // <-- ADD THIS DEFINITION
`#!/bin/bash
echo "Hello, World!" > index.html
nohup python -m SimpleHTTPServer 80 &`;

export const runEc2WebServer = async () => {
  const size = 't2.micro';

  // Get latest AWS AMI for Amazon Linux 2
  const ami = pulumi.output(aws.ec2.getAmi({
    filters: [{
      name: 'name',
      values: ['amzn-ami-hvm-*']
    }],
    owners: ['137112412989'], // This owner ID is Amazon
    mostRecent: true
  }));

  // Create Security Group for Web Server
  const group = new aws.ec2.SecurityGroup('web-secgrp', {
    ingress: [
      { protocol: 'tcp', fromPort: 80, toPort: 80, cidrBlocks: ['0.0.0.0/0'] }
    ]
  });

  const getDefaultVpc = async () => aws.ec2.getVpc({ default: true });

  const defaultVpc = await getDefaultVpc();

  const anyDefaultSubnet = aws.ec2.getSubnets({
    filters: [{
      name: 'vpc-id',
      values: [defaultVpc.id]
    }]
  });

  const subnet = await anyDefaultSubnet;

  // Create EC2 instance for Web Server
  const server = new aws.ec2.Instance('web-server', {
    instanceType: size,
    vpcSecurityGroupIds: [group.id],
    ami: ami.id,
    subnetId: subnet.ids[0],
    userData
  });

  return { publicIp: server.publicIp, publicHostname: server.publicDns };
};

